import { ResponsePayload } from '@utils/response-payload';
import { ListDeviceRequestImoQuery } from '../dto/query/list-device-request-imo.query';
import { ListSupplyRequestQuery } from '../dto/query/list-supply-request.query';
import { ApproveSupplyRequestRequest } from '../dto/request/approve-supply-request.request';
import { ConfirmSupplyRequestRequest } from '../dto/request/confirm-supply-request.request';
import { CreateSupplyRequest } from '../dto/request/create-supply-request.request';
import { DetailSupplyRequestRequest } from '../dto/request/detail-supply-request.request';
import { RejectSupplyRequestRequest } from '../dto/request/reject-supply-request.request';
import { UpdateActualQuantityRequest } from '../dto/request/update-actual-quantity.request';
import { UpdateSupplyRequest } from '../dto/request/update-supply-request.request';

export interface SupplyRequestServiceInterface {
  create(request: CreateSupplyRequest): Promise<ResponsePayload<any>>;
  update(request: UpdateSupplyRequest): Promise<ResponsePayload<any>>;
  list(request: ListSupplyRequestQuery): Promise<ResponsePayload<any>>;
  listImo(request: ListDeviceRequestImoQuery): Promise<ResponsePayload<any>>;
  detailImo(request: DetailSupplyRequestRequest): Promise<ResponsePayload<any>>;
  delete(request: DetailSupplyRequestRequest): Promise<ResponsePayload<any>>;
  detail(request: DetailSupplyRequestRequest): Promise<ResponsePayload<any>>;
  reject(request: RejectSupplyRequestRequest): Promise<ResponsePayload<any>>;
  confirm(request: ConfirmSupplyRequestRequest): Promise<ResponsePayload<any>>;
  approve(request: ApproveSupplyRequestRequest): Promise<ResponsePayload<any>>;
  updateActualQuantity(
    request: UpdateActualQuantityRequest,
  ): Promise<ResponsePayload<any>>;
  countSupplyByJob(
    request: DetailSupplyRequestRequest,
  ): Promise<ResponsePayload<any>>;
  getHistory(request: any): Promise<ResponsePayload<any>>;
}
