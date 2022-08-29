import { BaseDto } from '@core/dto/base.dto';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

class UpdateActualQuantity {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/)
  @IsNotBlank()
  code: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}
export class UpdateActualQuantityRequest extends BaseDto {
  @Type(() => UpdateActualQuantity)
  @ValidateNested({ each: true })
  @ArrayUnique<UpdateActualQuantity>((e) => e.code)
  @ArrayNotEmpty()
  items: UpdateActualQuantity[];

  @IsMongoId()
  @IsNotEmpty()
  requestId: string;
}
