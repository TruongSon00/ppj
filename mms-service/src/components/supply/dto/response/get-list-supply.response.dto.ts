import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetHistoryDetailResponseDto } from '@components/history/dto/response/get-history-detail.response.dto';
import { BaseResponseDto } from '@core/dto/base.response.dto';
export class SupplyGroup {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;
}

export class GetListSupplyResponseDto extends BaseResponseDto {
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
  itemUnitId: string;

  @ApiProperty()
  @Expose()
  type: number;

  @ApiProperty()
  @Expose()
  responsibleUserIds: number;

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
  supplyGroup: SupplyGroup;

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
