import { BaseModel } from '@core/model/base.model';
import { Assignment, DeviceAssignStatus } from './device-assignment.schema';
import { History } from '../history/history.model';

export class InformationDeviceAssignment {
  supplyId?: string;
  estMaintenceDate: Date;
  estReplaceDate: Date;
  mttrIndex: number;
  mttaIndex: number;
  mtbfIndex: number;
  mttfIndex: number;
  supplies?: InformationDeviceAssignment[];
}

export class MaintainRequestHistory {
  mttrIndex: number;
  mttaIndex: number;
  mtbfIndex: number;
  mttfIndex: number;
  maintainRequestId: string;
  usageTime: number;
  errorConfirmationTime: number;
  maintenanceExecutionTime: number;
  createdAt: Date;
}

export class ProductivityTargetHistory {
  productivityTarget: number;
  createdAt: Date;
}

class DeviceAssignmentHistory extends History {
  planCode?: string;
  planFrom?: Date;
  planTo?: Date;
  jobType?: number;
  jobId?: string;
}

class OperationTime {
  workOrderId: number;
  shiftId: number;
  operationDate: Date;
  actualOperationTime: number;
  actualBreakTime: number;
}
export interface DeviceAssignment extends BaseModel {
  userId: number;
  workTimeDataSource: number;
  assign: Assignment;
  responsibleUserId: number;
  status: DeviceAssignStatus;
  serial: string;
  updatedAt: Date;
  createdAt: Date;
  deviceId: string;
  factoryId: number;
  workCenterId: number;
  assignedAt: Date;
  usedAt: Date;
  deviceRequestId: string;
  oee: number;
  deletedAt: Date;
  histories: DeviceAssignmentHistory[];
  information: InformationDeviceAssignment;
  mttrIndex: number;
  mttaIndex: number;
  mtbfIndex: number;
  mttfIndex: number;
  maintainRequestHistories: MaintainRequestHistory[];
  operationTime?: OperationTime[];
  supplyIndex: any[];
  productivityTarget: number;
  productivityTargetHistories: ProductivityTargetHistory[];
}
