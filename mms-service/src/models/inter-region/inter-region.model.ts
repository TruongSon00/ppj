import { BaseModel } from '@core/model/base.model';

export interface InterRegionModel extends BaseModel {
  code: string;
  name: string;
  description: string;
  company: number;
}
