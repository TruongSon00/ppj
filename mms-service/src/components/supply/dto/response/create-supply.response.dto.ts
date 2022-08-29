import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseResponseDto } from '@core/dto/base.response.dto';

export class CreateSupplyResponseDto extends BaseResponseDto {
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
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
