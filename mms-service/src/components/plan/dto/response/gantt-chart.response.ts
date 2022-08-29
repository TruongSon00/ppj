import { BaseResponseDto } from '@core/dto/base.response.dto';
import { Expose, Transform, Type } from 'class-transformer';

class DetailGanChartPlanJobDevice extends BaseResponseDto {
  @Transform((v) => v.obj?.device[0]?.code)
  @Expose()
  code: string;

  @Transform((v) => v.obj?.device[0]?.name)
  @Expose()
  name: string;

  @Expose()
  serial: string;
}

class DetailGanChartPlanJobAssign {
  @Expose({
    name: 'assignId',
  })
  id: string;

  @Expose()
  name: string;
}

export class DetailGanChartPlanJob extends BaseResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  type: number;

  @Expose()
  status: number;

  @Expose()
  planFrom: Date;

  @Expose()
  planTo: Date;

  @Expose()
  endDate: Date;

  @Expose()
  executionDateFrom: Date;

  @Expose()
  executionDateTo: Date;

  @Type(() => DetailGanChartPlanJobDevice)
  @Transform(({ value }) => value[0])
  @Expose({
    name: 'deviceAssignment',
  })
  device: DetailGanChartPlanJobDevice;

  @Type(() => DetailGanChartPlanJobAssign)
  @Expose()
  assign: DetailGanChartPlanJobAssign;
}

export class GanttChartResponse extends BaseResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  status: number;

  @Expose()
  planFrom: Date;

  @Expose()
  planTo: Date;

  @Expose()
  endDate: Date;

  @Type(() => DetailGanChartPlanJob)
  @Expose()
  jobs: DetailGanChartPlanJob[];
}
