import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { SupplyRequest } from 'src/models/supply-request/supply-request.model';
import { ListSupplyRequestQuery } from '../dto/query/list-supply-request.query';
import { CreateSupplyRequest } from '../dto/request/create-supply-request.request';
import { DetailSupplyRequestRequest } from '../dto/request/detail-supply-request.request';

export interface SupplyRequestRepositoryInterface
  extends BaseInterfaceRepository<SupplyRequest> {
  createDocument(
    request: CreateSupplyRequest,
    type: number,
    deviceAssignmentId: string,
    isManufacture: boolean,
    teamId: string,
  ): Promise<SupplyRequest>;
  list(request: ListSupplyRequestQuery): Promise<any>;
  findAllWithPopulate(condition: any, populate: any): Promise<SupplyRequest[]>;
  detail(request: DetailSupplyRequestRequest): Promise<any>;
}
