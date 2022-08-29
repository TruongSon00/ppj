import { Expose, Transform } from 'class-transformer';

export class ListReportDeviceAssignStatusResponse {
  @Expose()
  @Transform((e) => e.obj._id.toString())
  deviceAssignId: string;

  @Expose()
  @Transform((e) => e.obj?.device?.name)
  deviceName: string;

  @Expose()
  serial: string;

  @Expose()
  username: string;

  @Expose()
  fullName: string;

  @Expose()
  usedAt: Date;

  @Expose()
  status: number;

  @Expose()
  numOfMaintain: number;

  @Expose()
  numOfError: number;
}
