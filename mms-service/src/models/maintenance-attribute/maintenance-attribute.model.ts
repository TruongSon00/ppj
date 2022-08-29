import { BaseModel } from '@core/model/base.model';
import { History } from '../history/history.model';

export interface MaintenanceAttribute extends BaseModel {
  code: string;
  name: string;
  description: string;
  histories: History[];
  isDeleted: boolean;
}
