import { BaseModel } from '@core/model/base.model';

export interface Warning extends BaseModel {
  defectId: string;
  completeExpectedDate: Date;
  description: string;
  status: number;
  executionDate: Date;
  type: number;
  deviceAssignmentId: string;
  maintanceSupplyId: string;
  supplies: any;
  actualSupplies: any;
  priority: number;
  name: string;
  checkType: number;
  code: string;
  maintanceType: number;
  details: [];
  histories: [];
  reason: string;
  scheduleDate: Date;
}
