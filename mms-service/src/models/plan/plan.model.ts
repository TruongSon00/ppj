import { BaseModel } from '@core/model/base.model';

export class JobTypeTotal {
  warningTotal: number;
  maintainRequestTotal: number;
  maintainPeriodWarningTotal: number;
  checklistTemplateTotal: number;
  installingTotal: number;
}

export class History {
  userId: number;
  action: number;
  createdAt: Date;
  username?: string;
  status?: number;
}

export interface Plan extends BaseModel {
  name: string;
  code: string;
  status: number;
  factoryId: number;
  workCenterId: number;
  planFrom: Date;
  planTo: Date;
  histories: History[];
  jobTypeTotal: JobTypeTotal;
  reason: string;
  createdBy: number;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
