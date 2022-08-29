import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { DetailDefectResponse } from '../../../defect/dto/response/detail-defect.response.dto';
import { DetailDeviceAssignmentResponse } from '../../../device-assignment/dto/response/detail-device-assignment.response.dto';
import { first, isEmpty } from 'lodash';
import { WARNING_TYPE_ENUM } from '@components/warning/warning.constant';

class WorkCenter {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @Expose()
  code: string;
}
export class DetailUser {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  fullName: string;

  @ApiProperty()
  @Expose()
  companyId: number;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  phone: string;
}

export class Details {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @Expose()
  subtitle: string;

  @ApiProperty()
  @Expose()
  obligatory: number;
}

export class WarningHistory {
  @Expose()
  userId: number;

  @Expose()
  userName: string;

  @Expose()
  action: string;

  @Expose()
  content: string;

  @Expose()
  createdAt: string;
}

class Supply extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  quantity: number;

  @ApiProperty()
  @Expose()
  maintainType: number;
}

export class DetailFactory {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  location: string;

  @ApiProperty()
  @Expose()
  companyId: number;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  status: number;
}

export class DetailCompany {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  taxNo: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  status: number;
}
export class DetailWarningResponse extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  defect: DetailDefectResponse;

  @ApiProperty()
  @Expose()
  priority: number;

  @ApiProperty()
  @Expose()
  completeExpectedDate: Date;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  executionDate: Date;

  @ApiProperty()
  @Expose()
  scheduleDate: Date;

  @ApiProperty()
  @Expose()
  type: number;

  @Type(() => WorkCenter)
  @Expose()
  workCenter: WorkCenter;

  @ApiProperty()
  @Expose()
  @Transform((value) => (!isEmpty(value?.value) ? value.value[0] : null))
  @Type(() => DetailDeviceAssignmentResponse)
  deviceAssignment: DetailDeviceAssignmentResponse;

  @ApiProperty()
  @Expose()
  user: DetailUser;

  @ApiProperty()
  @Expose()
  factory: DetailFactory;

  @ApiProperty()
  @Expose()
  company: DetailCompany;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  @Type(() => Supply)
  supplies: Supply[];

  @ApiProperty()
  @Expose()
  @Type(() => Supply)
  actualSupplies: Supply[];

  @ApiProperty()
  @Expose()
  @Type(() => WarningHistory)
  histories: WarningHistory[];

  @ApiProperty()
  @Expose()
  @Type(() => Details)
  details: Details[];

  @ApiProperty()
  @Expose()
  @Transform((data) => {
    if (!isEmpty(data?.obj?.deviceAssignment)) {
      const deviceAssignment: any = first(data?.obj?.deviceAssignment);
      return (
        deviceAssignment?.mttrIndex ?? deviceAssignment?.information?.mttrIndex
      );
    }
    return null;
  })
  expectedMaintenanceTime: number;

  @ApiProperty()
  @Expose()
  @Transform((data) => {
    switch (data.obj.type) {
      case WARNING_TYPE_ENUM.CHECKLIST_TEMPLATE:
        return !isEmpty(data.obj.checklistJob)
          ? data.obj.checklistJob[0]
          : null;
      case WARNING_TYPE_ENUM.PERIOD_MANTANCE:
        return !isEmpty(data.obj.maintenancePeriodJob)
          ? data.obj.maintenancePeriodJob[0]
          : null;
      case WARNING_TYPE_ENUM.WARNING:
        return !isEmpty(data.obj.warningJob) ? data.obj.warningJob[0] : null;
      default:
        null;
    }
  })
  @Type(() => Details)
  job: any;
}
