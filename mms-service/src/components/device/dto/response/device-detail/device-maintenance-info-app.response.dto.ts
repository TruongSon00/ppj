import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from '@utils/success.response.dto';
export class IndexInfoDto {
  @ApiProperty()
  @Expose()
  indexValue: number;

  @ApiProperty()
  @Expose()
  indexValueExchange: number;

  @ApiProperty()
  @Expose()
  maintenanceAttribute: string;
}

export class GetMaintainInfo {
  @ApiProperty({ description: 'Mã phụ tùng' })
  @Expose()
  code: string;

  @ApiProperty({ description: 'Tên phụ tùng' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Ngày dự kiến bảo trì' })
  @Expose()
  estMaintenanceDate: Date;

  @ApiProperty({ description: 'Ngày dự kiến thay thế' })
  @Expose()
  estReplaceDate: Date;

  @ApiProperty({ description: 'Thông số mttr' })
  @Expose()
  mttrIndex: number;

  @ApiProperty({ description: 'Thông số mtta' })
  @Expose()
  mttaIndex: number;

  @ApiProperty({ description: 'Thông số mttf' })
  @Expose()
  mttfIndex: IndexInfoDto;

  @ApiProperty({ description: 'Thông số mtbf' })
  @Expose()
  mtbfIndex: IndexInfoDto;
}

export class DeviceMaintenanceInfoAppResponse extends SuccessResponse {
  @ApiProperty({ description: 'Mã thiết bị' })
  @Expose()
  code: string;

  @ApiProperty({ description: 'Tên thiết bị' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Ngày dự kiến bảo trì' })
  @Expose()
  estMaintenanceDate: Date;

  @ApiProperty({ description: 'Ngày dự kiến thay thế' })
  @Expose()
  estReplaceDate: Date;

  @ApiProperty({ description: 'Thông số mttr' })
  @Expose()
  mttrIndex: number;

  @ApiProperty({ description: 'Thông số mtta' })
  @Expose()
  mttaIndex: number;

  @ApiProperty({ description: 'Thông số mttf' })
  @Expose()
  mttfIndex: IndexInfoDto;

  @ApiProperty({ description: 'Thông số mtbf' })
  @Expose()
  mtbfIndex: IndexInfoDto;

  @ApiProperty({
    description: 'Danh sách phụ tùng',
    type: GetMaintainInfo,
    isArray: true,
  })
  @Expose({
    name: 'information',
  })
  supplies: GetMaintainInfo[];
}
