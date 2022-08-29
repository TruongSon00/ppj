import { BaseModel } from '@core/model/base.model';

export interface VendorModel extends BaseModel {
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  bank: string;
  contactUser: string;
  description: string;
  active: number;
}
