import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BaseResponseDto } from '@core/dto/base.response.dto';
import { GetHistoryDetailResponseDto } from '@components/history/dto/response/get-history-detail.response.dto';

class Device extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  _id: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;
}

export class DetailDefectResponse extends BaseResponseDto {
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
  @Type(() => Device)
  devices: Device[];

  @ApiProperty()
  @Expose()
  priority: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  @Type(() => GetHistoryDetailResponseDto)
  histories: GetHistoryDetailResponseDto[];
}
