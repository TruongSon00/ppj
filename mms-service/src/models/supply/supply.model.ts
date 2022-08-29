import { BaseModel } from '@core/model/base.model';
import { History } from '../history/history.model';

export interface Supply extends BaseModel {
  code: string;
  name: string;
  type: number;
  itemUnitId: string;
  responsibleUserIds: number;
  responsibleMaintenanceTeam: string;
  groupSupplyId: string;
  description: string;
  status: number;
  price: number;
  receivedDate: Date;
  vendorId: number;
  histories: History[];
}
