import { BaseResponseDto } from '@core/dto/base.response.dto';
import { Expose, Type } from 'class-transformer';

export class DeviceGroupDetailDto extends BaseResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;
}

export class DeviceDetailDto extends BaseResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  serial: string;
}

export class FactoryDto {
  @Expose()
  id: number;

  @Expose()
  name: number;
}

export class DetailDeviceRequestTicketResponseDto extends BaseResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  quantity: number;

  @Expose()
  @Type(() => FactoryDto)
  factory: FactoryDto;

  @Expose()
  @Type(() => DeviceGroupDetailDto)
  deviceGroups: DeviceGroupDetailDto[];

  @Expose()
  status: number;

  @Expose()
  type: number;

  @Expose()
  @Type(() => DeviceDetailDto)
  devices: DeviceDetailDto[];
}
