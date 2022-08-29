import { BaseResponseDto } from '@core/dto/base.response.dto';
import { Expose, Type } from 'class-transformer';

class DeviceJobByPlanResponse extends BaseResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;
}

class DeviceAssignJobByPlanResponse {
  @Expose()
  id: string;

  @Expose()
  serial: string;

  @Type(() => DeviceJobByPlanResponse)
  @Expose()
  deviceId: string;
}

export class JobByPlanResponse extends BaseResponseDto {
  @Expose()
  code: string;

  @Expose()
  status: string;

  @Expose()
  type: string;

  @Expose()
  planId: string;

  @Expose()
  uuid: string;

  @Expose()
  priority: string;

  @Expose()
  planFrom: string;

  @Expose()
  planTo: string;

  @Type(() => DeviceAssignJobByPlanResponse)
  @Expose()
  deviceAssignmentId: DeviceAssignJobByPlanResponse;
}
