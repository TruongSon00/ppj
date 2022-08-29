import {
  ERROR_TYPE_CONST,
  ERROR_TYPE_PRIORITY_ENUM,
} from '@components/error-type/error-type.constant';
import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
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
import { DetailErrorTypeRequest } from './detail-error-type.request';

export class UpdateErrorTypeBodyDto extends BaseDto {
  @ApiProperty({ example: 'ABC123', description: 'Tên của loại lỗi' })
  @MinLength(ERROR_TYPE_CONST.NAME.MIN_LENGTH)
  @MaxLength(ERROR_TYPE_CONST.NAME.MAX_LENGTH)
  @Matches(ERROR_TYPE_CONST.NAME.REGEX)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ABC123', description: 'Mô tả của loại lỗi' })
  @MaxLength(ERROR_TYPE_CONST.DESCRIPTION.MAX_LENGTH)
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: 1, description: 'Mức ưu tiên của loại lỗi' })
  @IsEnum(ERROR_TYPE_PRIORITY_ENUM)
  @IsNotEmpty()
  priority: number;
}

export class UpdateErrorTypeRequest extends DetailErrorTypeRequest {
  @ApiProperty({ example: 'ABC123', description: 'Tên của loại lỗi' })
  @MinLength(ERROR_TYPE_CONST.NAME.MIN_LENGTH)
  @MaxLength(ERROR_TYPE_CONST.NAME.MAX_LENGTH)
  @Matches(ERROR_TYPE_CONST.NAME.REGEX)
  @IsString()
  @IsNotEmpty()
  @IsNotBlank()
  name: string;

  @ApiProperty({ example: 'ABC123', description: 'Mô tả của loại lỗi' })
  @MaxLength(ERROR_TYPE_CONST.DESCRIPTION.MAX_LENGTH)
  @IsString()
  @IsOptional()
  @IsNotBlank()
  description: string;

  @ApiProperty({ example: 1, description: 'Mức ưu tiên của loại lỗi' })
  @IsEnum(ERROR_TYPE_PRIORITY_ENUM)
  @IsNotEmpty()
  priority: number;
}
