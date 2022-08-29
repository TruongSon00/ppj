import { PLAN_CONST } from '@components/plan/plan.constant';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { BaseDto } from '@core/dto/base.dto';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

class JobTypeTotal {
  @IsNumber()
  @IsNotEmpty()
  warningTotal: number;

  @IsNumber()
  @IsNotEmpty()
  maintainRequestTotal: number;

  @IsNumber()
  @IsNotEmpty()
  maintainPeriodWarningTotal: number;

  @IsNumber()
  @IsNotEmpty()
  checklistTemplateTotal: number;

  @IsNumber()
  @IsNotEmpty()
  installingTotal: number;
}

export class UpdateDetailPlan {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsInt()
  @IsNotEmpty()
  type: number;

  @IsString()
  @IsNotEmpty()
  @IsNotBlank()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  planFrom: Date;

  @IsDateString()
  @IsNotEmpty()
  planTo: Date;

  @IsString()
  @IsNotEmpty()
  assign: string;
}

export class UpdatePlanBodyDto extends BaseDto {
  @MaxLength(PLAN_CONST.CODE.MAX_LENGTH)
  @IsString()
  @IsNotEmpty()
  @Matches(PLAN_CONST.CODE.REGEX)
  @IsNotBlank()
  code: string;

  @MaxLength(PLAN_CONST.NAME.MAX_LENGTH)
  @IsString()
  @IsNotEmpty()
  @Matches(PLAN_CONST.NAME.REGEX)
  @IsNotBlank()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  planFrom: Date;

  @IsDateString()
  @IsNotEmpty()
  planTo: Date;

  @IsString()
  @IsNotEmpty()
  uuid: string;

  @IsNumber()
  @IsOptional()
  factoryId: number;

  @IsNumber()
  @IsOptional()
  workCenterId: number;

  @Type(() => JobTypeTotal)
  @IsOptional()
  @IsNotEmpty()
  jobTypeTotal: JobTypeTotal;
}
export class UpdatePlanRequestDto extends UpdatePlanBodyDto {
  @IsNotEmpty()
  user: UserInforRequestDto;

  @IsString()
  @IsNotEmpty()
  id: string;
}
