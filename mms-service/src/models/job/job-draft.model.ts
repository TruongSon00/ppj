import { ASSIGN_TYPE, JOB_TYPE_ENUM } from '@components/job/job.constant';
import { BaseModel } from '@core/model/base.model';

export interface JobDraft extends BaseModel {
  deviceAssignmentId: string;
  assignId: string;
  planId: string;
  uuid: string;
  assignType: ASSIGN_TYPE;
  planFrom: Date;
  planTo: Date;
  type: JOB_TYPE_ENUM;
  status: number;
}
