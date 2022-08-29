import { BaseDto } from '@core/dto/base.dto';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class GanttChartPlanQuery extends BaseDto {
  @Transform((data) => Number(data.value))
  @IsOptional()
  user: number;
}
