import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CheckListTemplateDetailResponseDto } from '@components/checklist-template/dto/response/checklist-template-detail.response.dto';
import { GetHistoryDetailResponseDto } from '@components/history/dto/response/get-history-detail.response.dto';

class Device extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;
}

export class DetailCheckListTemplateResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  checkType: number;

  @ApiProperty()
  @Expose()
  @Type(() => Device)
  devices: Device[];

  @ApiProperty()
  @Expose()
  @Type(() => CheckListTemplateDetailResponseDto)
  details: CheckListTemplateDetailResponseDto[];

  @ApiProperty()
  @Expose()
  @Type(() => GetHistoryDetailResponseDto)
  histories: GetHistoryDetailResponseDto[];

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
