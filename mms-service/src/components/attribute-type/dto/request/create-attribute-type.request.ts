import { ATTRIBUTE_TYPE_CONST } from '@components/attribute-type/attribute-type.constant';
import { BaseDto } from '@core/dto/base.dto';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  IsMongoId,
} from 'class-validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class CreateAttributeTypeRequest extends BaseDto {
  @MaxLength(ATTRIBUTE_TYPE_CONST.CODE.MAX_LENGTH)
  @IsString()
  @IsNotEmpty()
  @Matches(ATTRIBUTE_TYPE_CONST.CODE.REGEX)
  @IsNotBlank()
  code: string;

  @MaxLength(ATTRIBUTE_TYPE_CONST.NAME.MAX_LENGTH)
  @IsString()
  @IsNotEmpty()
  @Matches(ATTRIBUTE_TYPE_CONST.NAME.REGEX)
  @IsNotBlank()
  name: string;

  @MaxLength(ATTRIBUTE_TYPE_CONST.DESCRIPTION.MAX_LENGTH)
  @IsString()
  @IsOptional()
  description: string;

  @IsMongoId()
  @IsNotEmpty()
  unit: string;
}
