import { DetailDeviceAssignmentResponse } from '@components/device-assignment/dto/response/detail-device-assignment.response.dto';
import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { isEmpty } from 'lodash';
import { DetailWarningResponse } from '../../../warning/dto/response/detail-warning.response.dto';

class Factory {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  phone: string;

  @Expose()
  companyId: number;

  @Expose()
  description: string;

  @Expose()
  location: string;

  @Expose()
  status: number;
}

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
class Supply extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  quantity: number;

  @ApiProperty()
  @Expose()
  maintainType: number;

  @ApiProperty()
  @Expose()
  type: number;

  @ApiProperty()
  @Expose()
  description: string;
}
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

  @Type(() => Factory)
  @Expose()
  factory: Factory;

  @Type(() => WorkCenter)
  @Expose()
  workCenter: WorkCenter;

  @ApiProperty()
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
  @Expose()
  @Type(() => Supply)
  supplies: Supply[];

  @ApiProperty()
  @Expose()
  @Type(() => Supply)
  actualSupplies: Supply[];
}

class CompanyDetail {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}
export class User {
  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  fullName: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  @Type(() => CompanyDetail)
  company: CompanyDetail;

  @ApiProperty()
  @Expose()
  @Type(() => Factory)
  factories: Factory[];

  @ApiProperty()
  @Expose()
  location: string;

  @ApiProperty()
  @Expose()
  description: string;
}

export class History extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  @Transform((value) => value.obj?.userName ?? null)
  username: string;

  @ApiProperty()
  @Expose()
  action: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}

export class DeatailChecklistTemplate {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  subtitle: string;

  @ApiProperty()
  @Expose()
  obligatory: number;

  @ApiProperty()
  @Expose()
  status: string;
}

export class DetailInstallationTemplate {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  @Transform((data) => data.value || data.obj.description || '')
  subtitle: string;

  @ApiProperty()
  @Expose()
  @Transform((data) => data.obj.description || '')
  description: string;

  @ApiProperty()
  @Expose()
  @Transform((data) => data.value || +data.obj.isRequire || 0)
  obligatory: boolean;

  @ApiProperty()
  @Expose()
  status: number;
}

export class InstallationTemplateItem extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @Type(() => Factory)
  @Expose()
  factory: Factory;

  @Type(() => WorkCenter)
  @Expose()
  workCenter: WorkCenter;

  @ApiProperty()
  @Expose()
  @Transform((value) => {
    return !isEmpty(value.value) ? value.value[0] : null;
  })
  @Type(() => DetailDeviceAssignmentResponse)
  deviceAssignment: DetailDeviceAssignmentResponse;

  @ApiProperty()
  @Expose()
  @Type(() => DetailInstallationTemplate)
  details: DetailInstallationTemplate[];

  @ApiProperty()
  @Expose()
  installResult: number;
}

export class CheckListTemplateItem extends BaseResponseDto {
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
  status: number;

  @ApiProperty()
  @Expose()
  checklistResult: number;

  @ApiProperty()
  @Expose()
  checklistConclude: number;

  @ApiProperty()
  @Expose()
  executionDate: Date;

  @Type(() => Factory)
  @Expose()
  factory: Factory;

  @Type(() => WorkCenter)
  @Expose()
  workCenter: WorkCenter;

  @ApiProperty()
  @Expose()
  @Type(() => DeatailChecklistTemplate)
  details: DeatailChecklistTemplate[];

  @ApiProperty({ type: History, isArray: true })
  @Expose()
  @Type(() => History)
  histories: History[];

  @ApiProperty()
  @Expose()
  @Transform((value) => (!isEmpty(value.value) ? value.value[0] : null))
  @Type(() => DetailDeviceAssignmentResponse)
  deviceAssignment: DetailDeviceAssignmentResponse;
}

class SupplyMaintenancePeriodWarning extends BaseResponseDto {
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
  price: number;
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
  executionDate: Date;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @Type(() => Factory)
  @Expose()
  factory: Factory;

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
  @Type(() => SupplyMaintenancePeriodWarning)
  @Transform((value) => (!isEmpty(value?.value) ? value.value[0] : []))
  supplies: SupplyMaintenancePeriodWarning;

  @ApiProperty()
  @Expose()
  @Type(() => Supply)
  actualSupplies: Supply[];
}

class DetailPlan extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  name: string;
}

export class DetailJobResponse extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  planDate: Date;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @Expose()
  @Transform((data) => data?.value ?? '')
  description: string;

  @ApiProperty()
  @Expose()
  maintenanceType: number;

  @ApiProperty({ type: User })
  @Expose()
  @Type(() => User)
  assignUsers: User;

  @ApiProperty({ type: History })
  @Expose()
  @Type(() => History)
  histories: History[];

  @ApiProperty({ type: MaintainRequest })
  @Expose()
  @Transform((value) => {
    return !isEmpty(value.value) ? value.value[0] : null;
  })
  @Type(() => MaintainRequest)
  maintainRequest: MaintainRequest;

  @ApiProperty({ type: InstallationTemplateItem })
  @Expose()
  @Transform((value) => {
    return !isEmpty(value.value) ? value.value[0] : null;
  })
  @Type(() => InstallationTemplateItem)
  installationTemplate: InstallationTemplateItem;

  @ApiProperty()
  @Expose()
  @Transform((value) => {
    return !isEmpty(value.value) ? value.value[0] : null;
  })
  @Type(() => DetailDeviceAssignmentResponse)
  deviceAssignment: DetailDeviceAssignmentResponse;

  @ApiProperty({ type: CheckListTemplateItem })
  @Expose()
  @Transform((value) => {
    return !isEmpty(value.value) ? value.value[0] : null;
  })
  @Type(() => CheckListTemplateItem)
  checklistTemplate: CheckListTemplateItem;

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

  @ApiProperty()
  @Expose()
  planFrom: Date;

  @ApiProperty()
  @Expose()
  planTo: Date;

  @ApiProperty()
  @Expose()
  @Transform((value) =>
    value.obj?.executionDateFrom ? new Date(value.obj.executionDateFrom) : null,
  )
  executionDateFrom: Date;

  @ApiProperty()
  @Expose()
  @Transform((value) =>
    value.obj?.executionDateTo ? new Date(value.obj.executionDateTo) : null,
  )
  executionDateTo: Date;

  @ApiProperty()
  @Expose()
  executionTime: number;

  @ApiProperty()
  @Expose()
  estMaintenance: number;

  @ApiProperty({ type: DetailPlan })
  @Expose()
  @Type(() => DetailPlan)
  @Transform((value) => (!isEmpty(value.value) ? value.value[0] : null))
  plan: DetailPlan;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
