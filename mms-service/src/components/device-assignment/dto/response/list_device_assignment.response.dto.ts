import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type, Transform } from 'class-transformer';
import { isEmpty } from 'lodash';

class Supply {
  @ApiProperty({})
  @Expose()
  @Transform((value) => value.obj.supplyId.toString())
  supplyId: string;

  @ApiProperty({})
  @Expose()
  quantity: number;

  @ApiProperty({})
  @Expose()
  useDate: number;

  @ApiProperty({})
  @Expose()
  maintenancePeriod: number;

  @ApiProperty({})
  @Expose()
  mttrIndex: number;

  @ApiProperty({})
  @Expose()
  mttaIndex: number;

  @ApiProperty({})
  @Expose()
  mttfIndex: number;

  @ApiProperty({})
  @Expose()
  mtbfIndex: number;
}

class DeviceInformationResponse {
  @ApiProperty({})
  @Expose()
  mttrIndex: number;

  @ApiProperty({})
  @Expose()
  mttaIndex: number;

  @ApiProperty({})
  @Expose()
  mttfIndex: number;

  @ApiProperty({})
  @Expose()
  mtbfIndex: number;

  @ApiProperty({ type: Supply, isArray: true })
  @Expose()
  @Type(() => Supply)
  supplies: Supply[];
}

export class DeviceResponse extends BaseResponseDto {
  @ApiProperty({})
  @Expose()
  name: string;

  @ApiProperty({})
  @Expose()
  model: string;

  @ApiProperty({ type: DeviceInformationResponse })
  @Expose()
  @Type(() => DeviceInformationResponse)
  information: DeviceInformationResponse;
}

export class DeviceAssignmentResponseDto extends BaseResponseDto {
  @ApiProperty({})
  @Expose()
  userId: string;

  @ApiProperty({})
  @Expose()
  status: string;

  @ApiProperty({})
  @Expose()
  serial: string;

  @ApiProperty({})
  @Expose()
  assignedAt: Date;

  @ApiProperty({})
  @Expose()
  usedAt: Date;

  @ApiProperty({})
  @Expose()
  createdAt: Date;

  @ApiProperty({})
  @Expose()
  updatedAt: Date;

  @ApiProperty({})
  @Expose()
  @Transform((value) => (!isEmpty(value.value) ? value.value[0] : null))
  @Type(() => DeviceResponse)
  device: DeviceResponse;

  @ApiProperty({})
  @Expose()
  supplyIndex: any[];
}
