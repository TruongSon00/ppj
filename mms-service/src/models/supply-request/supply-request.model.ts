import {
  SUPPLY_REQUEST_STATUS_ENUM,
  SUPPLY_REQUEST_TYPE_ENUM,
} from '@components/supply-request/supply-request.constant';
import { BaseModel } from '@core/model/base.model';

export class HistorySupplyRequest {
  userId: number;
  action: number;
  content: string;
  reason?: string;
  status?: number;
  createdAt: Date;
}

export class SupplyRequestDetail {
  supplyId: string;
  quantity: number;
  stockQuantity: number;
  planQuantity: number;
  buyQuantity: number;
  isManufacture: boolean;
  actualImportQuantity: number;
}

export class RequestedBy {
  teamId: string;
  userId: number;
}

export interface SupplyRequest extends BaseModel {
  code: string;
  name: string;
  description: string;
  type: SUPPLY_REQUEST_TYPE_ENUM;
  receiveExpectedDate: Date;
  requestedBy: RequestedBy;
  deviceAssignmentId: string;
  jobId: string;
  status: SUPPLY_REQUEST_STATUS_ENUM;
  supplies: SupplyRequestDetail[];
  histories: HistorySupplyRequest[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
