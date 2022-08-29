import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetHistoryDetailResponseDto } from '@components/history/dto/response/get-history-detail.response.dto';

export class UpdateDeviceGroupResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  @IsArray()
  responsibleUserIds: number[];

  @ApiProperty()
  @Expose()
  responsibleMaintenanceTeam: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  @Type(() => GetHistoryDetailResponseDto)
  histories: GetHistoryDetailResponseDto[];
}