import { BaseModel } from '@core/model/base.model';

interface MaintainRequestHistory {
  userId: number;
  userName: string;
  action: string;
  createdAt: Date;
  content: string;
  status: number;
  reason: string;
}
export interface MaintainRequest extends BaseModel {
  readonly code: string;
  name: string;
  status: number;
  description: string;
  deviceAssignmentId: string;
  completeExpectedDate: string;
  priority: number;
  supplies: any;
  createdAt: Date;
  updatedAt: Date;
  histories: MaintainRequestHistory[];
  type: number;
  expectedMaintainTime: number;
}
