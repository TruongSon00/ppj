import { ReportType } from '@constant/common';
import { BaseDto } from '@core/dto/base.dto';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class ReportProgressJobQuery extends BaseDto {
  @IsEnum(ReportType)
  @Transform((data) => Number(data.value))
  @IsNotEmpty()
  reportType: ReportType;

  @IsDateString()
  @IsOptional()
  startDate: Date;

  @IsDateString()
  @IsOptional()
  endDate: Date;
}
