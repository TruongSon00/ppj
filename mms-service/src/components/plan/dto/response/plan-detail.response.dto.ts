import { ASSIGN_TYPE } from '@components/job/job.constant';
import { PLAN_CONST } from '@components/plan/plan.constant';
import { BaseResponseDto } from '@core/dto/base.response.dto';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MATCHES,
  MaxLength,
  Min,
} from 'class-validator';

class JobTypeTotal {
  @Expose()
  @IsNumber()
  @Min(0)
  @IsOptional()
  warningTotal: number;

  @Expose()
  @IsNumber()
  @Min(0)
  @IsOptional()
  maintainRequestTotal: number;

  @Expose()
  @IsNumber()
  @Min(0)
  @IsOptional()
  maintainPeriodWarningTotal: number;

  @Expose()
  @IsNumber()
  @Min(0)
  @IsOptional()
  checklistTemplateTotal: number;

  @Expose()
  @IsNumber()
  @Min(0)
  @IsOptional()
  installingTotal: number;
}

class Device extends BaseResponseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;
}

class DeviceAssignment extends BaseResponseDto {
  @Expose()
  @Type(() => Device)
  @IsOptional()
  device: Device;

  @Expose()
  @IsString()
  @IsNotEmpty()
  serial: string;
}

class History extends BaseResponseDto {
  @Expose()
  userId: number;

  @Expose()
  action: number;

  @Expose()
  createdAt: Date;

  @Expose()
  username?: string;
}

class UserInfo extends BaseResponseDto {
  @Expose()
  @IsNumber()
  userId: number;

  @Expose()
  @IsNumber()
  teamId: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ASSIGN_TYPE)
  type: any;
}

export class JobData extends BaseResponseDto {
  @Expose()
  @IsNumber()
  @IsNotEmpty()
  type: number;

  @Expose()
  @Type(() => DeviceAssignment)
  @IsNotEmpty()
  deviceAssignment: DeviceAssignment;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  code: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  status: number;

  @Expose()
  @IsDateString()
  @IsNotEmpty()
  planFrom: Date;

  @Expose()
  @IsDateString()
  @IsNotEmpty()
  planTo: Date;

  @Expose()
  @IsDateString()
  @IsNotEmpty()
  executionDateFrom: Date;

  @Expose()
  @IsDateString()
  @IsNotEmpty()
  executionDateTo: Date;

  @Expose()
  @IsString()
  @IsNotEmpty()
  assignUsers: UserInfo[];
}

export class PlanDetailResponseDto extends BaseResponseDto {
  @Expose()
  @MaxLength(PLAN_CONST.CODE.MAX_LENGTH)
  @IsString()
  @IsNotEmpty()
  @Matches(PLAN_CONST.CODE.REGEX)
  code: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  status: number;

  @Expose()
  @MaxLength(PLAN_CONST.NAME.MAX_LENGTH)
  @IsString()
  @IsNotEmpty()
  @Matches(PLAN_CONST.NAME.REGEX)
  name: string;

  @Expose()
  factoryId: number;

  @Expose()
  factoryName: string;

  @Expose()
  workCenterId: number;

  @Expose()
  workCenterName: string;

  @Expose()
  @IsDateString()
  @IsNotEmpty()
  planFrom: Date;

  @Expose()
  @IsDateString()
  @IsNotEmpty()
  planTo: Date;

  @Expose()
  @Type(() => JobTypeTotal)
  @IsOptional()
  jobTypeTotal: JobTypeTotal;

  @Expose()
  @Type(() => JobData)
  @IsArray()
  @IsOptional()
  jobs: JobData[];

  @Expose()
  @Type(() => History)
  @IsArray()
  @IsOptional()
  histories: History[];

  @Expose()
  jobDrafts: any[];
}
