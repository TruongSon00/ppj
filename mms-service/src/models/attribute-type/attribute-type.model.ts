import { BaseModel } from '@core/model/base.model';
export interface AttributeType extends BaseModel {
  code: string;
  name: string;
  unit: string;
  description: string;
}
