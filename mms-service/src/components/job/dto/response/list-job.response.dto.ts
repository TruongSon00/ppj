import { ApiProperty } from '@nestjs/swagger';
import { DetailUser } from '../../../warning/dto/response/detail-warning.response.dto';
import { Expose, Transform, Type } from 'class-transformer';
import { BaseResponseDto } from '@core/dto/base.response.dto';
import { DetailDeviceAssignmentResponse } from '@components/device-assignment/dto/response/detail-device-assignment.response.dto';
import { plus } from '@utils/common';
import { isEmpty } from 'lodash';
import { DetailDefectResponse } from '@components/defect/dto/response/detail-defect.response.dto';
export class MaintainRequest extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  completeExpectedDate: Date;

  @ApiProperty()
  @Expose()
  type: number;

  @ApiProperty()
  @Expose()
  priority: number;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty({ type: DetailDeviceAssignmentResponse })
  @Expose()
  @Transform((value) => {
    return !isEmpty(value.value) ? value.value[0] : null;
  })
  @Type(() => DetailDeviceAssignmentResponse)
  deviceAssignment: DetailDeviceAssignmentResponse;

  @ApiProperty()
  @Expose()
  executionDate: Date;

  @ApiProperty()
  supplies: string;
}

export class DeatailChecklistTemplate {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  action: string;

  @ApiProperty()
  createdAt: Date;
}

export class ChecklistTemplate {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  checkType: number;

  @ApiProperty()
  @Expose()
  scheduleDate: Date;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  priority: number;

  @ApiProperty({ type: DetailDeviceAssignmentResponse })
  @Expose()
  @Transform((value) => {
    return !isEmpty(value.value) ? value.value[0] : null;
  })
  @Type(() => DetailDeviceAssignmentResponse)
  deviceAssignment: DetailDeviceAssignmentResponse;
}

class MaintenancePeriodWarningItem extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  priority: number;

  @ApiProperty()
  @Expose()
  completeExpectedDate: Date;

  @ApiProperty()
  @Expose()
  scheduleDate: Date;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  @Transform((value) => (!isEmpty(value.value) ? value.value[0] : null))
  @Type(() => DetailDeviceAssignmentResponse)
  deviceAssignment: DetailDeviceAssignmentResponse;
}

class ReworkResponse {
  @ApiProperty()
  @Expose()
  reason: string;

  @ApiProperty()
  @Expose()
  time: Date;
}

class User {
  @ApiProperty()
  @Expose()
  @Transform((data) => (data.value ? data.value.toString() : null))
  userId: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  fullname: string;
}

class DetailWarningResponse {
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
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}

export class InstallationTemplate {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  priority: number;

  @ApiProperty({ type: DetailDeviceAssignmentResponse })
  @Expose()
  @Transform((value) => {
    return !isEmpty(value.value) ? value.value[0] : null;
  })
  @Type(() => DetailDeviceAssignmentResponse)
  deviceAssignment: DetailDeviceAssignmentResponse;
}

class Plan extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  planTo: Date;

  @ApiProperty()
  @Expose()
  planFrom: Date;

  @ApiProperty()
  @Expose()
  code: string;
}

export class ListJobResponse extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  planTo: Date;

  @ApiProperty()
  @Expose()
  planFrom: Date;

  @ApiProperty()
  @Expose()
  executionDateTo: Date;

  @ApiProperty()
  @Expose()
  executionDateFrom: Date;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty({ type: User })
  @Expose()
  @Type(() => User)
  assign: User;

  @ApiProperty()
  @Expose()
  maintenanceType: number;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty({ type: MaintainRequest })
  @Expose()
  @Transform((value) => {
    return !isEmpty(value.value) ? value.value[0] : null;
  })
  @Type(() => MaintainRequest)
  maintainRequest: MaintainRequest;

  @ApiProperty()
  @Expose()
  @Transform((value) => {
    return plus(
      value.obj?.maintainRequest[0]?.deviceAssignment[0]?.device[0]?.information
        ?.mttaIndex || 0,
      value.obj?.maintainRequest[0]?.deviceAssignment[0]?.device[0]?.information
        ?.mttrIndex || 0,
    );
  })
  estMaintenance: number;

  @ApiProperty({ type: ChecklistTemplate })
  @Expose()
  @Transform((value) => {
    return !isEmpty(value.value) ? value.value[0] : null;
  })
  @Type(() => ChecklistTemplate)
  checklistTemplate: ChecklistTemplate;

  @ApiProperty({ type: InstallationTemplate })
  @Expose()
  @Transform((value) => {
    return !isEmpty(value.value) ? value.value[0] : null;
  })
  @Type(() => InstallationTemplate)
  installationTemplate: InstallationTemplate;

  @ApiProperty({ type: DetailWarningResponse })
  @Expose()
  @Transform((value) => {
    return !isEmpty(value.value) ? value.value[0] : null;
  })
  @Type(() => DetailWarningResponse)
  warning: DetailWarningResponse;

  @ApiProperty({ type: MaintenancePeriodWarningItem })
  @Expose()
  @Transform((value) => {
    return !isEmpty(value.value) ? value.value[0] : null;
  })
  @Type(() => MaintenancePeriodWarningItem)
  maintenancePeriodWarning: MaintenancePeriodWarningItem;

  // @ApiProperty()
  // @Expose()
  // @Transform((value) => (!isEmpty(value.value) ? value.value[0] : null))
  // @Type(() => DetailDeviceAssignmentResponse)
  // deviceAssignment: DetailDeviceAssignmentResponse;

  // @ApiProperty()
  // @Expose()
  // @Transform((value) => (!isEmpty(value.value) ? value.value[0] : null))
  // @Type(() => Plan)
  // plan: Plan;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  @Type(() => ReworkResponse)
  reworks: ReworkResponse[];
}
