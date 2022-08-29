import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsEnum } from 'class-validator';

import { BaseResponseDto } from '@core/dto/base.response.dto';
import {
  DeviceStatus,
  DeviceType,
  ResponsibleSubjectType,
} from '@components/device/device.constant';
export class ResponsibleUser {
  @ApiProperty()
  @Expose()
  id: string | number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  @IsEnum(ResponsibleSubjectType)
  type: ResponsibleSubjectType;
}

export class DeviceUsageDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  fullName: string;

  @ApiProperty()
  @Expose()
  date: Date;
}

export class ResponsibleMaintenanceTeam extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;
}

export class DeviceAssignmentDto {
  @ApiProperty()
  @Expose()
  id: string;
  @ApiProperty()
  @Expose()
  serial: string;
  @ApiProperty()
  @Expose()
  date: Date;
}

export class FactoryResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;
}

export class WorkCenterResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;
}

export class DeviceCommonInfoResponseDto {
  @ApiProperty({ example: '123', description: 'Id của device' })
  @Expose()
  id: string;

  @ApiProperty({ example: '123', description: 'Mã của device' })
  @Expose()
  code: string;

  @ApiProperty({ example: '123', description: 'Tên của device' })
  @Expose()
  name: string;

  @ApiProperty({ example: '123', description: 'Mô tả của device' })
  @Expose()
  description: string;

  @ApiProperty({ example: 1, description: 'Loại device' })
  @Expose()
  @IsEnum(DeviceType)
  type: number;

  @ApiProperty()
  @Expose()
  estimatedMaintenance: Date;

  @ApiProperty({
    example: {
      user: {
        id: 1,
        username: 'admin',
        fullName: 'Admin',
      },
      date: '2021-12-21T07:59:21.272Z',
    },
  })
  @Expose()
  @Type(() => DeviceUsageDto)
  assignmentUser: DeviceUsageDto;

  @ApiProperty({
    example: {
      serial: '61c17e563edf369ea06ab801',
      date: '2021-12-21T07:59:21.272Z',
    },
  })
  @Expose()
  @Type(() => DeviceAssignmentDto)
  deviceAssignment: DeviceAssignmentDto;

  @ApiProperty({ example: 1, description: 'Tần suất' })
  @Expose()
  frequency: number;

  @ApiProperty({
    example: {
      id: 1,
      username: 'admin',
      fullName: 'Admin',
    },
  })
  @Expose()
  @Type(() => ResponsibleUser)
  responsibleUser: ResponsibleUser;

  @ApiProperty({ example: 1, description: 'trạng thái' })
  @Expose()
  @IsEnum(DeviceStatus)
  status: number;

  @ApiProperty({ example: 1, description: 'oee mục tiêu' })
  @Expose()
  @Transform((data) => data?.value ?? null)
  oee: number;

  @ApiProperty({ example: 1, description: 'năng suất mục tiêu' })
  @Expose()
  @Transform((data) => data?.value ?? null)
  productivityTarget: number;

  @ApiProperty()
  @Expose()
  factory: FactoryResponseDto;

  @ApiProperty()
  @Expose()
  workCenter: FactoryResponseDto;
}
