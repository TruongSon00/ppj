import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { DEVICE_GROUP_CONST } from '@components/device-group/device-group.constant';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

class SupplyRequest {
  @ApiProperty()
  @IsMongoId()
  supplyId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  estimateUsedTime: number;
}
export class CreateDeviceGroupRequestDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(DEVICE_GROUP_CONST.CODE.MAX_LENGTH)
  @MinLength(DEVICE_GROUP_CONST.CODE.MIN_LENGTH)
  @IsString()
  @Matches(DEVICE_GROUP_CONST.CODE.REGEX)
  @IsNotBlank()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(DEVICE_GROUP_CONST.NAME.MAX_LENGTH)
  @MinLength(DEVICE_GROUP_CONST.NAME.MIN_LENGTH)
  @IsString()
  @Matches(DEVICE_GROUP_CONST.NAME.REGEX)
  @IsNotBlank()
  name: string;

  @ApiProperty()
  @MaxLength(DEVICE_GROUP_CONST.DESCRIPTION.MAX_LENGTH)
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @IsArray()
  @ArrayUnique((e) => e.supplyId)
  supplies: SupplyRequest[];
}
