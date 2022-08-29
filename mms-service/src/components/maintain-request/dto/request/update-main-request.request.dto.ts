import { JOB_CONST } from '@components/job/job.constant';
import { MAINTAIN_REQUEST_PRIORITY_ENUM } from '@components/maintain-request/maintain-request.constant';
import { BaseDto } from '@core/dto/base.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

class SupplyUpdateItem {
  @IsString()
  @IsNotEmpty()
  supplyId: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(999)
  quantity: number;
}

export class UpdateMaintainBodyDto extends BaseDto {}

export class UpdateMaintainRequestDto extends UpdateMaintainBodyDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  deviceAssignmentId: string;

  @IsString()
  @IsOptional()
  @MaxLength(JOB_CONST.DESCRIPTION.MAX_LENGTH)
  description: string;

  @IsString()
  @IsOptional()
  @MaxLength(JOB_CONST.NAME.MAX_LENGTH)
  @IsNotBlank()
  name: string;

  @IsDateString()
  @IsOptional()
  completeExpectedDate: string;

  @IsDateString()
  @IsOptional()
  executionDate: string;

  @IsInt()
  @IsOptional()
  @IsEnum(MAINTAIN_REQUEST_PRIORITY_ENUM)
  priority: number;

  @IsInt()
  @IsOptional()
  status: number;

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => SupplyUpdateItem)
  supplies: SupplyUpdateItem[];
}
