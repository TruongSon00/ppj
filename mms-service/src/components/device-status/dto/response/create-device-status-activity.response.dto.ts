import { Expose } from 'class-transformer';

export class CreateDeviceStatusActivityResponseDto {
  @Expose()
  deviceAssignmentId: string;

  @Expose()
  actives: DeviceStatusActivityDetailResponseDto[];
}
export class DeviceStatusActivityDetailResponseDto {

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  status: number;

  @Expose()
  moId: number;

  @Expose()
  attributes: Attributes[];
}

export class Attributes {
  @Expose()
  key: string;

  @Expose()
  value: string;
}