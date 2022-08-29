import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { AreaModel } from 'src/models/area/area.model';
import { GetListAreaQuery } from '../dto/request/get-list-area.query';

export interface AreaRepositoryInterface
  extends BaseAbstractRepository<AreaModel> {
  list(request: GetListAreaQuery): Promise<any>;
  import(bulkOps: any): Promise<any>;
}
