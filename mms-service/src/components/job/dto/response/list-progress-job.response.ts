import { BaseResponseDto } from '@core/dto/base.response.dto';
import { Expose, Transform } from 'class-transformer';

export class ListProgressJobResponse extends BaseResponseDto {
  @Transform((v) => v.obj?.deviceAssignment[0]?.serial || null)
  @Expose()
  serial: string;

  @Transform((v) => v.obj?.deviceAssignment[0]?.device[0]?.name || null)
  @Expose()
  deviceName: string;

  @Expose()
  description: string;

  @Expose()
  status: string;

  @Expose()
  planFrom: Date;

  @Expose()
  planTo: Date;

  @Expose()
  executionDateFrom: Date;

  @Expose()
  executionDateTo: Date;

  @Expose()
  type: Number;

  @Expose()
  code: string;
}
