import { UNIT_CONST } from '@components/unit/unit.constant';
import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class CreateUnitRequest extends BaseDto {
  @ApiProperty({ example: 'ABC123', description: 'Code của đơn vị' })
  @MaxLength(UNIT_CONST.CODE.MAX_LENGTH)
  @MinLength(UNIT_CONST.CODE.MIN_LENGTH)
  @Matches(UNIT_CONST.CODE.REGEX)
  @IsString()
  @IsNotBlank()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'ABC123', description: 'Tên của đơn vị' })
  @MaxLength(UNIT_CONST.NAME.MAX_LENGTH)
  @MinLength(UNIT_CONST.NAME.MIN_LENGTH)
  @Matches(UNIT_CONST.NAME.REGEX)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ABC123', description: 'Mô tả của đơn vị' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(UNIT_CONST.DESCRIPTION.MAX_LENGTH)
  @IsOptional()
  description: string;
}
