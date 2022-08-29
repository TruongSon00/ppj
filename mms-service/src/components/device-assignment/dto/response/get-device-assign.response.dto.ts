import { Expose } from 'class-transformer';

class User {
  @Expose()
  userId: number;

  @Expose()
  fullName: string;

  @Expose()
  username: string;
}
class Factory {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;
}

class History extends User {
  @Expose()
  action: number;

  @Expose()
  createdAt: Date;
}

export class GetDeviceAssignResponseDto {
  @Expose()
  id: string;

  @Expose()
  requestId: string;

  @Expose()
  requestCode: string;

  @Expose()
  assignUser: User;

  @Expose()
  responsibleUser: User;

  @Expose()
  deviceCode: string;

  @Expose()
  deviceName: string;

  @Expose()
  deviceId: string;

  @Expose()
  deviceType: number;

  @Expose()
  serial: string;

  @Expose()
  model: string;

  @Expose()
  assignedAt: Date;

  @Expose()
  usedAt: Date;

  @Expose()
  status: number;

  @Expose()
  factory: Factory;

  @Expose()
  workCenter: Factory;

  @Expose()
  oee: number;

  @Expose()
  workTimeDataSource: number;

  @Expose()
  productivityTarget: number;

  @Expose()
  histories: History;
}
