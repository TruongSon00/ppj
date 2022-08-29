import { Types } from 'mongoose';
import { BaseModel } from '@core/model/base.model';

class Attributes {
  key: string;
  value: string;
}
export class DeviceStatusModel extends BaseModel {
  deviceAssignmentId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  attributes: Attributes[];
  status: number;
  moId: number;
  isDeleted: boolean;
  passQuantity: number;
  actualQuantity: number;
}
