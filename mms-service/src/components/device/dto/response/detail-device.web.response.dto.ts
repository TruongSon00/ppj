import {
  DeviceStatus,
  DeviceType,
  ResponsibleSubjectType,
} from '@components/device/device.constant';
import { Expose, Type } from 'class-transformer';
import { History } from '../../../../models/history/history.model';
import { Types } from 'mongoose';
import { BaseResponseDto } from '@core/dto/base.response.dto';

export class MaintenanceAttributeDto {
  id: string;
  name: string;
}

export class DeviceGroupDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
export class MaintenanceInfoExchangeDto {
  indexValue: number;
  indexValueExchange: number;
  maintenanceAttribute: string;
}

export class MaintenanceInfoDto {
  maintenancePeriod: number;
  mttrIndex: number;
  mttaIndex: number;
  mttfIndex: MaintenanceInfoExchangeDto;
  mtbfIndex: MaintenanceInfoExchangeDto;
}

export class SupplyDto {
  id: string;
  name: string;
  type: number;
}

export class DeviceSupplyDto {
  supply: SupplyDto;
  quantity: number;
  useDate: number;
  canRepair: boolean;
}

export class AccessoriesMaintenanceInformationDto extends MaintenanceInfoDto {
  supply: SupplyDto;
}

export class ResponsibleSubjectDto {
  id: string | number;
  name: string;
  type: ResponsibleSubjectType;
}

export class VendorDto {
  id: number;
  name: string;
}

export class CheckListTemplateResponse extends BaseResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;
}

export class DetailDeviceWebResponseDto extends MaintenanceInfoDto {
  id: string;
  code: string;
  name: string;
  description: string;
  model: string;
  price: number;
  status: DeviceStatus;
  attributeType: string[];
  installTemplate: string;
  canRepair: boolean;

  @Expose()
  deviceGroup: Types.ObjectId;

  @Type(() => CheckListTemplateResponse)
  @Expose()
  checkListTemplate: CheckListTemplateResponse;

  type: DeviceType;
  frequency: number;
  maintenanceAttribute: MaintenanceAttributeDto;
  periodicInspectionTime: number;
  vendor: VendorDto;
  brand: string;
  productionDate: Date;
  importDate: Date;
  warrantyPeriod: number;
  accessoriesMaintenanceInformation: AccessoriesMaintenanceInformationDto[];
  suppliesAndAccessories: DeviceSupplyDto[];
  responsibleSubject: ResponsibleSubjectDto;
  histories: History[];
}
