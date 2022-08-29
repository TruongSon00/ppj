import { SUPPLY_CONST } from '@components/supply/supply.constant';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { BaseDto } from '@core/dto/base.dto';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class CreateSupplyRequest extends BaseDto {
  @IsMongoId()
  @IsNotEmpty()
  jobId: string;

  @IsString()
  @IsOptional()
  @Matches(SUPPLY_CONST.CODE.REGEX)
  @IsNotBlank()
  code: string;

  @IsString()
  @IsOptional()
  @Matches(SUPPLY_CONST.NAME.REGEX)
  @IsNotBlank()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  receiveExpectedDate: Date;

  @ArrayUnique<CreateSupplyRequestDetail>(
    (e: CreateSupplyRequestDetail) => e.supplyId,
  )
  @Type(() => CreateSupplyRequestDetail)
  @ArrayNotEmpty()
  supplies: CreateSupplyRequestDetail[];

  @IsNotEmpty()
  user: UserInforRequestDto;
}

class CreateSupplyRequestDetail {
  @IsMongoId()
  @IsNotEmpty()
  supplyId: string;

  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
