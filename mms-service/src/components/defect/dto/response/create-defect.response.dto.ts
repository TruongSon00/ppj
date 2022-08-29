import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetHistoryDetailResponseDto } from '@components/history/dto/response/get-history-detail.response.dto';

export class CreateDefectResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  _id: string;

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
  priority: number;

  @ApiProperty()
  @Expose()
  deviceId: string;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  createdAt: number;

  @ApiProperty()
  @Expose()
  updatedAt: number;

  @ApiProperty()
  @Expose()
  @Type(() => GetHistoryDetailResponseDto)
  histories: GetHistoryDetailResponseDto[];
}
