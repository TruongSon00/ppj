import { UpdateUnitActiveStatusPayload } from './../dto/request/update-unit-status.request';
import { ResponsePayload } from '@utils/response-payload';
import { GetListUnitQuery } from '../dto/request/get-list-unit.query';
import { CreateUnitRequest } from '../dto/request/create-unit.request';
import { DetailUnitRequest } from '../dto/request/detail-unit.request';
import { UpdateUnitRequest } from '../dto/request/update-unit.request';

export interface UnitServiceInterface {
  create(request: CreateUnitRequest): Promise<ResponsePayload<any>>;
  update(request: UpdateUnitRequest): Promise<ResponsePayload<any>>;
  detail(request: DetailUnitRequest): Promise<ResponsePayload<any>>;
  list(request: GetListUnitQuery): Promise<ResponsePayload<any>>;
  import(data: any): Promise<{ dataSuccess: any[]; dataError: any[] }>;
  updateStatus(request: UpdateUnitActiveStatusPayload): Promise<any>;
}
