import { ResponsePayload } from '@utils/response-payload';
import { CreateErrorTypeRequest } from '../dto/request/create-error-type.request';
import { DetailErrorTypeRequest } from '../dto/request/detail-error-type.request';
import { GetListErrorTypeQuery } from '../dto/request/get-list-error-type.query';
import { UpdateErrorTypeRequest } from '../dto/request/update-error-type.request';

export interface ErrorTypeServiceInterface {
  create(request: CreateErrorTypeRequest): Promise<ResponsePayload<any>>;
  update(request: UpdateErrorTypeRequest): Promise<ResponsePayload<any>>;
  detail(request: DetailErrorTypeRequest): Promise<ResponsePayload<any>>;
  list(request: GetListErrorTypeQuery): Promise<ResponsePayload<any>>;
  import(data: any): Promise<{ dataSuccess: any[]; dataError: any[] }>;
}
