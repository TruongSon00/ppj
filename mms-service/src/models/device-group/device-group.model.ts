import { BaseModel } from '@core/model/base.model';

interface Supply {
  supplyId: string;
  quantity: number;
  estimateUsedTime: number;
}
export interface DeviceGroup extends BaseModel {
  code: string;
  name: string;
  description: string;
  active: number;
  supplies: Supply[];
}
