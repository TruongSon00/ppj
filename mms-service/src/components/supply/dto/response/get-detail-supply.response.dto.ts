import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { GetHistoryDetailResponseDto } from '@components/history/dto/response/get-history-detail.response.dto';
import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ResponsibleSubjectType } from '@components/device/device.constant';

class ItemUnit {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;
}
class responsibleUser {
  id: number | string;
  name: string;
  type: ResponsibleSubjectType;
}

class SupplyGroup extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;
}

class Vendor {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;
}

export class GetDetailSupplyResponseDto extends BaseResponseDto {
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
  responsibleUser: responsibleUser;

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
  @Type(() => SupplyGroup)
  supplyGroup: SupplyGroup[];

  @ApiProperty()
  @Expose()
  @Type(() => Vendor)
  vendor: Vendor;

  @ApiProperty()
  @Expose()
  receivedDate: Date;

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
