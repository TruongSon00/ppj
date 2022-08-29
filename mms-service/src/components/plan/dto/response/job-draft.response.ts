import { BaseResponseDto } from '@core/dto/base.response.dto';
import { Expose, Transform, Type } from 'class-transformer';

class WorkCenterResponse {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;
}

export class JobDraftResponse extends BaseResponseDto {
  @Transform(({ obj }) => obj.deviceAssignmentId?._id)
  @Expose()
  deviceAssignmentId: string;

  @Expose()
  id: string;

  @Expose()
  code: string;

  @Transform(({ obj }) => obj.deviceAssignmentId?.deviceId?.name)
  @Expose()
  deviceName: string;

  @Transform(({ obj }) => obj.deviceAssignmentId?.serial)
  @Expose()
  serial: string;

  @Expose()
  assignUser: string;

  @Expose()
  status: number;

  @Type(() => WorkCenterResponse)
  @Expose()
  workCenter: WorkCenterResponse;

  @Expose()
  planFrom: Date;

  @Expose()
  planTo: Date;

  @Expose()
  executionDateFrom: Date;

  @Expose()
  executionDateTo: Date;

  @Expose()
  type: number;
}
