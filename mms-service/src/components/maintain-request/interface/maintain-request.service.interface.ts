import { ResponsePayload } from '@utils/response-payload';
import { MaintainRequest } from 'src/models/maintain-request/maintain-request.model';
import { ApproveMaintainRequestDto } from '../dto/request/approve-maintain-request.request.dto';
import { CreateMaintainRequestDto } from '../dto/request/create-maintain-request.request.dto';
import { GetMaintainRequestByAssignDeviceRequest } from '../dto/request/get-maintain-request-by-assign-device.request.dto';
import { GetMaintainRequestHistoriesDto } from '../dto/request/get-maintain-request-history.request.dto';
import { ListMaintainRequestDto } from '../dto/request/list-maintain-request.request.dto';
import { UpdateMaintainRequestDto } from '../dto/request/update-main-request.request.dto';
import { UpdateMaintainRequestStatusDto } from '../dto/request/update-status-maintain-request.request.dto';

export interface MaintainRequestServiceInterface {
  create(payload: CreateMaintainRequestDto): Promise<ResponsePayload<any>>;
  update(
    payload: UpdateMaintainRequestDto,
  ): Promise<MaintainRequest | ResponsePayload<any>>;
  delete(id: string): Promise<ResponsePayload<any>>;
  approve(request: ApproveMaintainRequestDto): Promise<ResponsePayload<any>>;
  reject(request: ApproveMaintainRequestDto): Promise<ResponsePayload<any>>;
  list(request: ListMaintainRequestDto): Promise<ResponsePayload<any>>;
  detail(id: string): Promise<ResponsePayload<any>>;
  getMaintainRequestByAssignDevice(
    request: GetMaintainRequestByAssignDeviceRequest,
  ): Promise<ResponsePayload<any>>;
  completeMaintainRequest(
    request: UpdateMaintainRequestStatusDto,
  ): Promise<ResponsePayload<any>>;
  reDoingMaintainRequest(
    request: UpdateMaintainRequestStatusDto,
  ): Promise<ResponsePayload<any>>;
  getMaintainRequestHistory(
    request: GetMaintainRequestHistoriesDto,
  ): Promise<ResponsePayload<any>>;
}
