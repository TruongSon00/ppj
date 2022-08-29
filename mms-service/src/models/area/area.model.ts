import { BaseModel } from '@core/model/base.model';

export interface AreaModel extends BaseModel {
  code: string;
  name: string;
  description: string;
  factoryId: number;
}
