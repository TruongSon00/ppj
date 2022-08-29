import { PLAN_CONST } from '@components/plan/plan.constant';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { BaseDto } from '@core/dto/base.dto';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

class JobTypeTotal {
  @IsNumber()
  @Min(0)
  @IsOptional()
  warningTotal: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maintainRequestTotal: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maintainPeriodWarningTotal: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  checklistTemplateTotal: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  installingTotal: number;
}

export class CreatePlanRequestDto extends BaseDto {
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
  @IsOptional()
  uuid: string;

  @IsNumber()
  @IsOptional()
  factoryId: number;

  @IsNumber()
  @IsOptional()
  workCenterId: number;

  @Type(() => JobTypeTotal)
  @IsOptional()
  jobTypeTotal: JobTypeTotal;

  @IsNotEmpty()
  user: UserInforRequestDto;
}
