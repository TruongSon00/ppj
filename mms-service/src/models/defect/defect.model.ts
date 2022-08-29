import { BaseModel } from '@core/model/base.model';
import { History } from '../history/history.model';

export interface Defect extends BaseModel {
  code: string;
  name: string;
  description: string;
  deviceId: string;
  priority: number;
  status: number;
  histories: History[];
  isDeleted: boolean;
}
