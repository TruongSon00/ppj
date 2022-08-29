import { BaseModel } from '@core/model/base.model';
import { History } from '../history/history.model';

export class ChecklistTemplateDetail {
  title: string;
  description: string;
  obligatory: number;
  status: string;
  subtitle: string;
}

export interface ChecklistTemplate extends BaseModel {
  code: string;
  name: string;
  description: string;
  checkType: number;
  details: ChecklistTemplateDetail[];
  histories: History[];
  deletedAt: Date;
}
