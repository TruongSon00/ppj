import { BaseResponseDto } from '@core/dto/base.response.dto';
import { Expose, Transform, Type } from 'class-transformer';

class DeviceResponse extends BaseResponseDto {
  @Expose()
  status: number;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  id: string;
}
class DeiveAssignment extends BaseResponseDto {
  @Expose()
  serial: string;

  @Expose()
  workTimeDataSource: number;

  @Expose()
  productivityTarget: number;

  @Type(() => DeviceResponse)
  @Expose()
  deviceId: DeviceResponse;

  @Type(() => DeviceResponse)
  @Expose()
  device: DeviceResponse;
}

class Factory {
  @Expose()
  id: number;

  @Expose()
  description: string;

  @Expose()
  name: string;

  @Expose()
  location: string;

  @Expose()
  companyId: number;

  @Expose()
  code: string;

  @Expose()
  phone: string;
}

class WorkCenter {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;
}

class JobType {
  @Type(() => DeiveAssignment)
  @Expose()
  deviceAssignment: DeiveAssignment;

  @Type(() => Factory)
  @Expose()
  factory: Factory;

  @Type(() => WorkCenter)
  @Expose()
  workCenter: WorkCenter;
}

export class DetailJobDraftResponse extends BaseResponseDto {
  @Expose()
  status: number;

  @Expose()
  planFrom: Date;

  @Expose()
  planTo: Date;

  @Expose()
  type: number;

  @Type(() => DeiveAssignment)
  @Transform(({ obj }) => obj.deviceAssignmentId)
  @Expose()
  deviceAssignment: DeiveAssignment;

  @Type(() => JobType)
  @Expose()
  maintenancePeriodWarning: JobType;

  @Type(() => JobType)
  @Expose()
  checklistTemplate: JobType;
}
