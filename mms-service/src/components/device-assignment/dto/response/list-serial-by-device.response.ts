import { Expose, Transform } from 'class-transformer';

export class ListSerialByDeviceResponse {
  @Expose({ name: 'id' })
  deviceAssignmentId: string;

  @Expose()
  serial: string;

  @Transform((value) => value.obj?.deviceId?.name)
  @Expose()
  deviceName: string;
}
