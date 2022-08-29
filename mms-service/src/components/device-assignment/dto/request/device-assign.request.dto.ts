import { WorkTimeDataSourceEnum } from '@components/device-assignment/device-assignment.constant';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { BaseDto } from '@core/dto/base.dto';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class DeviceAssignRequestDto extends BaseDto {
  @IsMongoId()
  @IsNotEmpty()
  deviceRequestId: string;

  @IsString()
  @MaxLength(15)
  @Transform((value) => value.value.toString())
  @Matches(/^[\w.-]+$/)
  @IsNotEmpty()
  @IsNotBlank()
  serial: string;

  @IsDateString()
  @IsNotEmpty()
  assignedAt: Date;

  @IsDateString()
  @IsNotEmpty()
  usedAt?: Date;

  @IsNumber()
  @IsOptional()
  oee?: number;

  @IsString()
  @IsNotEmpty()
  responsibleUserId: string;

  @IsNotEmpty()
  user: UserInforRequestDto;

  @IsEnum(WorkTimeDataSourceEnum)
  @IsOptional()
  workTimeDataSource?: number;

  @IsNumber()
  @IsOptional()
  productivityTarget?: number;
}
