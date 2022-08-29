import {
  MAINTAIN_REQUEST_CONST,
  MAINTAIN_REQUEST_PRIORITY_ENUM,
  MAINTAIN_REQUEST_TYPE_ENUM,
} from '@components/maintain-request/maintain-request.constant';
import { BaseDto } from '@core/dto/base.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

class SupplyItemCreate {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  supplyId: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(999)
  quantity: number;
}

export class CreateMaintainRequestDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  deviceAssignmentId: string;

  @IsString()
  @MaxLength(MAINTAIN_REQUEST_CONST.DESCRIPTION.MAX_LENGTH)
  @IsOptional()
  description: string;

  @IsString()
  @MaxLength(MAINTAIN_REQUEST_CONST.NAME.MAX_LENGTH)
  @Matches(MAINTAIN_REQUEST_CONST.NAME.REGEX)
  @IsNotEmpty()
  @IsNotBlank()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  completeExpectedDate: Date;

  @IsInt()
  @IsNotEmpty()
  @IsEnum(MAINTAIN_REQUEST_PRIORITY_ENUM)
  priority: number;

  @IsInt()
  @IsOptional()
  @IsEnum(MAINTAIN_REQUEST_TYPE_ENUM)
  type: number;

  @IsArray()
  @IsOptional()
  @Type(() => SupplyItemCreate)
  @ValidateNested()
  supplies: SupplyItemCreate[];

  @IsNumber()
  @IsOptional()
  expectedMaintainTime: number;
}
