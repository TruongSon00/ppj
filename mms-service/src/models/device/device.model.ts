import { BaseModel } from '@core/model/base.model';
import { History } from '../history/history.model';
import { Types } from 'mongoose';
import { DeviceStatus, DeviceType } from '@components/device/device.constant';

export class DeviceSupply {
  supplyId: string;
  quantity: number;
  useDate: number;
  maintenancePeriod: number;
  mttrIndex: number;
  mttaIndex: number;
  mttfIndex: number;
  mtbfIndex: number;
  canRepair: boolean;
}

export class DeviceInformation {
  vendor: number;
  importDate: Date;
  brand: string;
  productionDate: Date;
  warrantyPeriod: number;
  maintenancePeriod: number;
  mttrIndex: number;
  mttaIndex: number;
  mttfIndex: number;
  mtbfIndex: number;
  maintenanceAttributeId: string;
  supplies: DeviceSupply[];
}

export interface Device extends BaseModel {
  code: string;
  name: string;
  frequency: number;
  responsibleUserId: number;
  responsibleMaintenanceTeamId: string;
  model: string;
  histories: History[];
  price: number;
  description: string;
  type: DeviceType;
  status: DeviceStatus;
  periodicInspectionTime: number;
  information: DeviceInformation;
  deviceGroup: Types.ObjectId;
  attributeType: string[];
  installTemplate: string;
  checkListTemplateId: string;
  canRepair: boolean;
}
