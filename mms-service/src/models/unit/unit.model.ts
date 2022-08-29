import { BaseModel } from '@core/model/base.model';

export interface UnitModel extends BaseModel {
  code: string;
  name: string;
  description: string;
  active: number;
}
