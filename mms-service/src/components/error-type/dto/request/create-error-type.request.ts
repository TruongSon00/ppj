import {
  ERROR_TYPE_CONST,
  ERROR_TYPE_PRIORITY_ENUM,
} from '@components/error-type/error-type.constant';
import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class CreateErrorTypeRequest extends BaseDto {
  @ApiProperty({ example: 'ABC123', description: 'Code của loại lỗi' })
  @MaxLength(ERROR_TYPE_CONST.CODE.MAX_LENGTH)
  @MinLength(ERROR_TYPE_CONST.CODE.MIN_LENGTH)
  @Matches(ERROR_TYPE_CONST.CODE.REGEX)
  @IsString()
  @IsNotBlank()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'ABC123', description: 'Tên của loại lỗi' })
  @MaxLength(ERROR_TYPE_CONST.NAME.MAX_LENGTH)
  @MinLength(ERROR_TYPE_CONST.NAME.MIN_LENGTH)
  @Matches(ERROR_TYPE_CONST.NAME.REGEX)
  @IsString()
  @IsNotEmpty()
  @IsNotBlank()
  name: string;

  @ApiProperty({ example: 'ABC123', description: 'Mô tả của loại lỗi' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(ERROR_TYPE_CONST.DESCRIPTION.MAX_LENGTH)
  @IsOptional()
  description: string;

  @ApiProperty({ example: 1, description: 'Mức ưu tiên của loại lỗi' })
  @IsEnum(ERROR_TYPE_PRIORITY_ENUM)
  @IsNotEmpty()
  priority: number;
}
