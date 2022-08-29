import {
  IsNotEmpty,
  IsDateString,
  IsArray,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsString,
  IsInt,
  Min,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { IsNoSqlId } from 'src/validator/is-nosql-id.validator';
import { IsSqlId } from 'src/validator/is-sql-id.validator';
import { DEVICE_STATUS_ENUM } from 'src/components/device-status/device-status.constant';
import { Type } from 'class-transformer';
import { BaseDto } from '@core/dto/base.dto';

export class CreateDeviceStatusActivityRequestDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsNoSqlId()
  deviceAssignmentId: string;

  @Expose()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DeviceStatusActivityDetailRequestDto)
  actives: DeviceStatusActivityDetailRequestDto[];
}
export class DeviceStatusActivityDetailRequestDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsNotEmpty()
  @IsEnum(DEVICE_STATUS_ENUM)
  status: number;

  @Expose()
  @IsSqlId()
  @IsOptional()
  moId: number;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  passQuantity: number;

  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  actualQuantity: number;

  @Expose()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Attributes)
  attributes: Attributes[];
}

export class Attributes {
  @Expose()
  @IsOptional()
  @IsString()
  key: string;

  @Expose()
  @IsOptional()
  @IsString()
  value: string;
}
