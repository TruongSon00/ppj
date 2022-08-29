import { Expose } from 'class-transformer';
export class DeviceStatusActivityInfoRequestDto {
  @Expose()
  data: ListDeviceStatusActivityInfo[];

  @Expose()
  serial: string;

  @Expose()
  id: string;

  @Expose()
  totalOee: number;

  @Expose()
  deviceName: string;

  @Expose()
  status: number;

  @Expose()
  type: number;
}

export class ListDeviceStatusActivityInfo {
  @Expose({ name: 'startDate' })
  date: Date;

  @Expose()
  active: number;

  @Expose()
  vacation: number;

  @Expose()
  oee: number;

  @Expose()
  stop: number;

  @Expose()
  attributes: Attributes[];
}

export class Attributes {
  @Expose()
  key: string;

  @Expose()
  value: string;
}

export class History {
  @Expose()
  _id: string;

  @Expose()
  status: string;

  @Expose()
  action: string;

  @Expose()
  actionBy: string;

  @Expose()
  actionAt: string;

  @Expose()
  user: string;
}
