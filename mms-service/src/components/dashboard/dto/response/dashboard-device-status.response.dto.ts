import { DEVICE_STATUS_ENUM } from '@components/device-status/device-status.constant';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsInt, IsString } from 'class-validator';
import * as moment from 'moment';

export class MoItem {
  @IsString()
  @Expose()
  id: string;

  @IsString()
  @Expose()
  name: string;
}

export class DashboardDeviceStatusTotal {
  @IsInt()
  @Expose()
  totalInActive: number;

  @IsInt()
  @Expose()
  totalInStop: number;

  @IsInt()
  @Expose()
  totalInError: number;

  @IsInt()
  @Expose()
  totalInMaintain: number;

  @IsInt()
  @Expose()
  totalInShutDown: number;

  @IsInt()
  @Expose()
  totalInUse: number;
}

export class DashboardDeviceData {
  @Expose()
  serial: string;

  @IsEnum(DEVICE_STATUS_ENUM)
  @Expose()
  status: number;

  @IsDate()
  @Expose()
  activeTime: string;
}

export class DashboardDeviceStatusResponseDto {
  @IsDate()
  @Expose()
  exportedAt: Date;

  @IsInt()
  @Expose()
  oee: number;

  @IsInt()
  @Expose()
  deviceTotal: number;

  @Type(() => DashboardDeviceStatusTotal)
  @Expose()
  totalDeviceStatus: DashboardDeviceStatusTotal;

  @IsArray()
  @Type(() => DashboardDeviceData)
  @Expose()
  deviceStatusData: DashboardDeviceData[];

  @IsArray()
  @Type(() => MoItem)
  @Expose()
  moList: MoItem[];
}
