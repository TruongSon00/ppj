import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BaseResponseDto } from '@core/dto/base.response.dto';
import { GetHistoryDetailResponseDto } from '@components/history/dto/response/get-history-detail.response.dto';

class ItemUnit {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;
}

export class UpdateSupplyResponseDto extends BaseResponseDto {
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
  @Type(() => ItemUnit)
  itemUnit: ItemUnit[];

  @ApiProperty()
  @Expose()
  type: number;

  @ApiProperty()
  @Expose()
  responsibleUserIds: number[];

  @ApiProperty()
  @Expose()
  responsibleMaintenanceTeam: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  groupSupplyId: string;

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