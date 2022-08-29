import { BaseModel } from '@core/model/base.model';
export interface SupplyGroup extends BaseModel {
  code: string;
  name: string;
  description: string;
  active: number;
}
