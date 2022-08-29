import { ResponsePayload } from '@utils/response-payload';
import { DetailRegionRequest } from '../dto/request/detail-region.request';
import { GetListRegionQuery } from '../dto/request/get-list-region.query';

export interface RegionServiceInterface {
  detail(request: DetailRegionRequest): Promise<ResponsePayload<any>>;
  list(request: GetListRegionQuery): Promise<ResponsePayload<any>>;
  import(data: any): Promise<{ dataSuccess: any[]; dataError: any[] }>;
}
