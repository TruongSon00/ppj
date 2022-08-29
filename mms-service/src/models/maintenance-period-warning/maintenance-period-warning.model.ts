import { BaseModel } from '@core/model/base.model';

export interface MaintenancePeriodWarning extends BaseModel {
  readonly code: string;
  name: string;
  description: string;
  status: number;
  priority: number;
  type: number;
  deviceAssignmentId: string;
  supplyId: string;
  supplies: any;
  completeExpectedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
