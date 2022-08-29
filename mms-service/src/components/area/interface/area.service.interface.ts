import { ResponsePayload } from '@utils/response-payload';
import { DetailAreaRequest } from '../dto/request/detail-area.request';
import { GetListAreaQuery } from '../dto/request/get-list-area.query';

export interface AreaServiceInterface {
  detail(request: DetailAreaRequest): Promise<ResponsePayload<any>>;
  list(request: GetListAreaQuery): Promise<ResponsePayload<any>>;
  import(data: any): Promise<{ dataSuccess: any[]; dataError: any[] }>;
}
