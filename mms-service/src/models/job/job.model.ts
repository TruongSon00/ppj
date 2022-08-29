import {
  ASSIGN_TYPE,
  JOB_STATUS_ENUM,
  JOB_TYPE_ENUM,
  JOB_TYPE_MAINTENANCE_ENUM,
} from '@components/job/job.constant';
import { BaseModel } from '@core/model/base.model';

export class ActualSupply {
  supplyId: string;
  quantity: number;
  description: string;
  maintenanceType: JOB_TYPE_MAINTENANCE_ENUM;
}

export class HistoryJob {
  userId: number;
  action: string;
  content: string;
  reason: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Assign {
  assignId: string;
  type: ASSIGN_TYPE;
  description: string;
}

export interface Job extends BaseModel {
  code: string;
  name: string;
  description: string;
  status: JOB_STATUS_ENUM;
  type: JOB_TYPE_ENUM;
  jobTypeId: string;
  planId: string;
  priority: number;
  deviceAssignmentId: string;
  actualSupplies: ActualSupply[];
  supplies: ActualSupply[];
  assign: Assign[];
  planFrom: Date;
  planTo: Date;
  executionDateFrom: Date;
  executionDateTo: Date;
  histories: HistoryJob[];
  deletedAt: Date;
  result: any;
  createdAt: Date;
  updatedAt: Date;
}
