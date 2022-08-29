import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import {
  CheckTypeEnum,
  CHECK_LIST_TEMPLATE_CONST,
} from '@components/checklist-template/checklist-template.constant';
import { BaseDto } from '@core/dto/base.dto';
import { CheckListTemplateDetailRequestDto } from '@components/checklist-template/dto/request/checklist-template-detail.request.dto';

export class CreateCheckListTemplateRequestDto extends BaseDto {
  @ApiProperty({ example: 'ABC123', description: 'Code của mẫu phiếu báo cáo' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(CHECK_LIST_TEMPLATE_CONST.CODE.MAX_LENGTH)
  @Matches(CHECK_LIST_TEMPLATE_CONST.CODE.REGEX)
  code: string;

  @ApiProperty({ example: 'ABC123', description: 'Tên của mẫu phiếu báo cáo' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(CHECK_LIST_TEMPLATE_CONST.NAME.MAX_LENGTH)
  @Matches(CHECK_LIST_TEMPLATE_CONST.NAME.REGEX)
  name: string;

  @ApiProperty({ example: 'Mô tả', description: 'Mô tả' })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(CHECK_LIST_TEMPLATE_CONST.DESCRIPTION.MAX_LENGTH)
  description: string;

  @ApiProperty({ example: 1, description: 'Loại kiểm tra' })
  @Expose()
  @IsNotEmpty()
  @IsEnum(CheckTypeEnum)
  checkType: number;

  @ApiProperty({ description: 'Chi tiết' })
  @Expose()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ArrayUnique((e: CheckListTemplateDetailRequestDto) => e.title)
  @Type(() => CheckListTemplateDetailRequestDto)
  details: CheckListTemplateDetailRequestDto[];
}
