import { ResponsePayload } from '@utils/response-payload';
import { GetListWarningRequestDto } from '../dto/request/list-warning.request.dto';

export interface WarningServiceInterface {
  createWarning(payload: any): Promise<ResponsePayload<any>>;
  detailWarning(payload: any): Promise<ResponsePayload<any>>;
  getListWarning(payload: GetListWarningRequestDto): Promise<any>;
  warningReject(payload: any): Promise<ResponsePayload<any>>;
  warningApprove(payload: any): Promise<ResponsePayload<any>>;
}
