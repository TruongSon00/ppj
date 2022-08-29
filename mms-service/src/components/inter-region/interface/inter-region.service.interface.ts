import { ResponsePayload } from '@utils/response-payload';
import { GetListInterRegionQuery } from '../dto/request/get-list-inter-region.query';
import { DetailInterRegionRequest } from '../dto/request/detail-inter-region.request';

export interface InterRegionServiceInterface {
  detail(request: DetailInterRegionRequest): Promise<ResponsePayload<any>>;
  list(request: GetListInterRegionQuery): Promise<ResponsePayload<any>>;
  import(data: any): Promise<{ dataSuccess: any[]; dataError: any[] }>;
}
