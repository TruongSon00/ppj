import { ReportType } from '@constant/common';
import { BaseDto } from '@core/dto/base.dto';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class DashboardMttrMttaIndexQuery extends BaseDto {
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

  @IsNumber()
  @Transform((value) => Number(value.value))
  @IsOptional()
  factory: number;

  @IsMongoId()
  @IsOptional()
  maintainTeam: string;
}
