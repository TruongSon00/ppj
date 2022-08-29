import { UNIT_CONST } from '@components/unit/unit.constant';
import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';
import { DetailUnitRequest } from './detail-unit.request';

export class UpdateUnitBodyDto extends BaseDto {
  @ApiProperty({ example: 'ABC123', description: 'Mã của đơn vị' })
  @MinLength(UNIT_CONST.CODE.MIN_LENGTH)
  @MaxLength(UNIT_CONST.CODE.MAX_LENGTH)
  @Matches(UNIT_CONST.CODE.REGEX)
  @IsString()
  @IsOptional()
  @IsNotBlank()
  code: string;

  @ApiProperty({ example: 'ABC123', description: 'Tên của đơn vị' })
  @MinLength(UNIT_CONST.NAME.MIN_LENGTH)
  @MaxLength(UNIT_CONST.NAME.MAX_LENGTH)
  @Matches(UNIT_CONST.NAME.REGEX)
  @IsString()
  @IsNotEmpty()
  @IsNotBlank()
  name: string;

  @ApiProperty({ example: 'ABC123', description: 'Mô tả của đơn vị' })
  @MaxLength(UNIT_CONST.DESCRIPTION.MAX_LENGTH)
  @IsString()
  @IsOptional()
  description: string;
}

export class UpdateUnitRequest extends DetailUnitRequest {
  @ApiProperty({ example: 'ABC123', description: 'Tên của đơn vị' })
  @MinLength(UNIT_CONST.NAME.MIN_LENGTH)
  @MaxLength(UNIT_CONST.NAME.MAX_LENGTH)
  @Matches(UNIT_CONST.NAME.REGEX)
  @IsString()
  @IsNotEmpty()
  @IsNotBlank()
  name: string;

  @ApiProperty({ example: 'ABC123', description: 'Mô tả của đơn vị' })
  @MaxLength(UNIT_CONST.DESCRIPTION.MAX_LENGTH)
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: 'ABC123', description: 'Mã của đơn vị' })
  @MinLength(UNIT_CONST.CODE.MIN_LENGTH)
  @MaxLength(UNIT_CONST.CODE.MAX_LENGTH)
  @Matches(UNIT_CONST.CODE.REGEX)
  @IsString()
  @IsOptional()
  @IsNotBlank()
  code: string;
}
