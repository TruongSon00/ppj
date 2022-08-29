import { BaseModel } from '@core/model/base.model';

export interface ErrorTypeModel extends BaseModel {
  code: string;
  name: string;
  description: string;
  priority: number;
}
