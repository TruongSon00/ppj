import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import {
  CheckTypeEnum,
  CHECK_LIST_TEMPLATE_CONST,
} from '@components/checklist-template/checklist-template.constant';
import { IsNoSqlId } from 'src/validator/is-nosql-id.validator';
import { CheckListTemplateDetailRequestDto } from '@components/checklist-template/dto/request/checklist-template-detail.request.dto';

export class UpdateChecklistTemplateParamDto extends BaseDto {
  @ApiProperty({
    example: '61a8974b4711d21f394d57ff',
    description: 'id của mẫu phiếu báo cáo',
  })
  @Expose()
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

export class UpdateCheckListTemplateRequestBodyDto extends BaseDto {
  @ApiProperty({ example: 'ABC123', description: 'Mã của mẫu phiếu báo cáo' })
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

  @ApiProperty({ example: 'Mô tả', description: 'Loại kiểm tra' })
  @Expose()
  @IsNotEmpty()
  @IsEnum(CheckTypeEnum)
  checkType: number;

  @ApiProperty({ example: 0, description: 'Chi tiết' })
  @Expose()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ArrayUnique((e: CheckListTemplateDetailRequestDto) => e.title)
  @Type(() => CheckListTemplateDetailRequestDto)
  details: CheckListTemplateDetailRequestDto[];
}
export class UpdateCheckListTemplateRequestDto extends UpdateCheckListTemplateRequestBodyDto {
  @ApiProperty({
    example: '61a8974b4711d21f394d57ff',
    description: 'Mã của mẫu phiếu báo cáo',
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsNoSqlId()
  @MaxLength(CHECK_LIST_TEMPLATE_CONST.CODE.MAX_LENGTH)
  id: string;
}
