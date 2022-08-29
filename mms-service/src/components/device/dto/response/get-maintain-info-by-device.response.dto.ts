import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from '@utils/success.response.dto';
import { Expose } from 'class-transformer';

class GetMaintainInfo {
  @Expose()
  @ApiProperty({ description: 'Tên phụ tùng' })
  name: string;

  @Expose()
  @ApiProperty({ description: 'Ngày dự kiến bảo trì' })
  estMaintenceDate: Date;

  @Expose()
  @ApiProperty({ description: 'Ngày dự kiến thay thế' })
  estReplaceDate: Date;

  @Expose()
  maintenancePeriod: number;

  @Expose()
  @ApiProperty({ description: 'Thông số mttr' })
  mttrIndex: number;

  @Expose()
  @ApiProperty({ description: 'Thông số mtta' })
  mttaIndex: number;

  @Expose()
  @ApiProperty({ description: 'Thông số mttf' })
  mttfIndex: number;

  @Expose()
  @ApiProperty({ description: 'Thông số mtbf' })
  mtbfIndex: number;
}

export class GetMaintainInfoByDeviceResponse extends SuccessResponse {
  @Expose()
  @ApiProperty({ description: 'Tên thiết bị' })
  name: string;

  @Expose()
  @ApiProperty({ description: 'Ngày dự kiến bảo trì' })
  estMaintenceDate: Date;

  @Expose()
  @ApiProperty({ description: 'Ngày dự kiến thay thế' })
  estReplaceDate: Date;

  @Expose()
  maintenancePeriod: number;

  @Expose()
  @ApiProperty({ description: 'Thông số mttr' })
  mttrIndex: number;

  @Expose()
  @ApiProperty({ description: 'Thông số mtta' })
  mttaIndex: number;

  @Expose()
  @ApiProperty({ description: 'Thông số mttf' })
  mttfIndex: number;

  @Expose()
  @ApiProperty({ description: 'Thông số mtbf' })
  mtbfIndex: number;

  @Expose({
    name: 'information',
  })
  @ApiProperty({
    description: 'Danh sách phụ tùng',
    type: GetMaintainInfo,
    isArray: true,
  })
  details: GetMaintainInfo[];
}
