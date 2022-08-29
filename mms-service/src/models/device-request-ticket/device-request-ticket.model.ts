import {
  DEVICE_REQUEST_STATUS_ENUM,
  DEVICE_REQUEST_TYPE_ENUM,
} from 'src/components/device-request/device-request.constant';
import { BaseModel } from '@core/model/base.model';

export interface DeviceRequestTicket extends BaseModel {
  code: string;
  name: string;
  description: string;
  factoryId: number;
  quantity: number;
  createdBy: number;
  deviceGroupIds: string[];
  status: DEVICE_REQUEST_STATUS_ENUM;
  type: DEVICE_REQUEST_TYPE_ENUM;
  deviceIds?: any[];
}
