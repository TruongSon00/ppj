import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { UnitModel } from 'src/models/unit/unit.model';
import { GetListUnitQuery } from '../dto/request/get-list-unit.query';
import { CreateUnitRequest } from '../dto/request/create-unit.request';
import { ListUnitResponse } from '../dto/response/list-unit.response';

export interface UnitRepositoryInterface
  extends BaseAbstractRepository<UnitModel> {
  createEntity(request: CreateUnitRequest): UnitModel;
  updateEntity(entity: UnitModel, request: CreateUnitRequest): UnitModel;
  list(request: GetListUnitQuery): Promise<ListUnitResponse>;
  import(bulkOps: any): Promise<any>;
}
