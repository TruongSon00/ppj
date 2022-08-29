import {
  DEVICE_REQUEST_TYPE_ENUM,
  ListDeviceRequestStatus,
} from '@components/device-request/device-request.constant';
import { Expose, Transform } from 'class-transformer';
import { WorkCenterDto } from '@components/device/dto/response/device-detail/manufacturing-info.response.dto';
import { DeviceStatus, DeviceType } from '@components/device/device.constant';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  fullName: string;
}

export class DeviceDto {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  serial: string;

  @Expose()
  model: string;

  @Expose()
  userId: number;

  @Expose()
  user: UserDto;

  @Expose()
  status: DeviceStatus;

  @Expose()
  type: DeviceType;
}

export class ListDeviceRequestsResponseDto {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  devices: DeviceDto[];

  @Expose()
  type: DEVICE_REQUEST_TYPE_ENUM;

  @Expose()
  quantity: number;

  @Expose()
  actualImportQuantity: number;

  @Transform((v) => Number(v.obj.deviceAssignments?.length))
  @Expose()
  assignedQuantity: number;

  @Expose()
  status: ListDeviceRequestStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  workCenter: WorkCenterDto;
}
