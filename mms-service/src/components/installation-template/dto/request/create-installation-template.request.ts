import { INSTALLATION_TEMPLATE_CONST } from '@components/installation-template/installation-template.constant';
import { BaseDto } from '@core/dto/base.dto';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class CreateInstallationTemplateDetail {
  @MaxLength(INSTALLATION_TEMPLATE_CONST.NAME.MAX_LENGTH)
  @IsString()
  @IsNotEmpty()
  title: string;

  @MaxLength(INSTALLATION_TEMPLATE_CONST.DESCRIPTION.MAX_LENGTH)
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsOptional()
  isRequire: boolean;
}

export class CreateInstallationTemplateRequest extends BaseDto {
  @MaxLength(INSTALLATION_TEMPLATE_CONST.CODE.MAX_LENGTH)
  @IsString()
  @IsNotEmpty()
  @Matches(INSTALLATION_TEMPLATE_CONST.CODE.REGEX)
  code: string;

  @MaxLength(INSTALLATION_TEMPLATE_CONST.NAME.MAX_LENGTH)
  @IsString()
  @IsNotEmpty()
  @Matches(INSTALLATION_TEMPLATE_CONST.NAME.REGEX)
  name: string;

  @MaxLength(INSTALLATION_TEMPLATE_CONST.DESCRIPTION.MAX_LENGTH)
  @IsString()
  @IsOptional()
  description: string;

  @Type(() => CreateInstallationTemplateDetail)
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  details: CreateInstallationTemplateDetail[];
}
