import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SUPPLY_GROUP_CONST } from '@components/supply-group/supply-group.constant';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class CreateSupplyGroupRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @MaxLength(SUPPLY_GROUP_CONST.CODE.MAX_LENGTH)
  @MinLength(SUPPLY_GROUP_CONST.CODE.MIN_LENGTH)
  @IsString()
  @Matches(SUPPLY_GROUP_CONST.CODE.REGEX)
  @IsNotBlank()
  code: string;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @MaxLength(SUPPLY_GROUP_CONST.NAME.MAX_LENGTH)
  @MinLength(SUPPLY_GROUP_CONST.NAME.MIN_LENGTH)
  @IsString()
  @Matches(SUPPLY_GROUP_CONST.NAME.REGEX)
  @IsNotBlank()
  name: string;

  @ApiProperty()
  @Expose()
  @MaxLength(SUPPLY_GROUP_CONST.DESCRIPTION.MAX_LENGTH)
  @IsOptional()
  @IsString()
  description: string;
}
