import { BaseResponseDto } from '@core/dto/base.response.dto';
import { Expose, Type } from 'class-transformer';

class RequestCreator {
  @Expose()
  userId: number;

  @Expose()
  username: string;

  @Expose()
  fullname: string;

  @Expose()
  maintenanceTeam: string;
}

class SparePart extends BaseResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  type: number;

  @Expose()
  unit: string;

  @Expose()
  price: number;

  @Expose()
  quantity: number;
}

class WorkCenter {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

class Factory {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

class DeviceAssignment extends BaseResponseDto {
  @Expose()
  name: string;

  @Expose()
  serial: string;

  @Expose()
  @Type(() => WorkCenter)
  workCenter: WorkCenter;

  @Expose()
  @Type(() => Factory)
  factory: Factory;

  @Expose()
  @Type(() => SparePart)
  sparePartDetails: SparePart[];
}

export class JobCreateSuppyRequestResponseDto extends BaseResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  type: number;

  @Expose()
  @Type(() => DeviceAssignment)
  deviceAssignment: DeviceAssignment;

  @Expose()
  workCenter: WorkCenter;

  @Expose()
  factory: Factory;
}
