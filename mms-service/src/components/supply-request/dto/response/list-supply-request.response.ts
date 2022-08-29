import { Expose, Transform } from 'class-transformer';

export class ListSupplyRequestResponse {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Transform((v) => v.obj?.deviceAssignmentId?.deviceId?.name || null)
  @Expose()
  deviceName: string;

  @Expose()
  teamName: string;

  @Expose()
  fullName: string;

  @Transform((v) => v.obj?.supplies?.map((e) => e.supplyId.name).join(','))
  @Expose()
  supplyName: string;

  @Expose()
  type: number;

  @Expose()
  status: number;

  @Expose()
  createdAt: Date;
}
