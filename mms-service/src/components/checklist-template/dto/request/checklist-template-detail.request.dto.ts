import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CHECK_LIST_TEMPLATE_CONST } from '@components/checklist-template/checklist-template.constant';
import { CheckListTemplateObligatoryConstant } from '@components/checklist-template/checklist-template.constant';

export class CheckListTemplateDetailRequestDto {
  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(CHECK_LIST_TEMPLATE_CONST.TITLE.MAX_LENGTH)
  title: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(CHECK_LIST_TEMPLATE_CONST.DESCRIPTION.MAX_LENGTH)
  description: string;

  @ApiProperty()
  @Expose()
  @IsEnum(CheckListTemplateObligatoryConstant)
  @IsOptional()
  obligatory: number;

  @IsString()
  @IsOptional()
  subtitle: string;
}
