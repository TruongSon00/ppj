import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { RegionModel } from 'src/models/region/region.model';
import { GetListRegionQuery } from '../dto/request/get-list-region.query';
import { ListRegionResponse } from '../dto/response/list-region.response';

export interface RegionRepositoryInterface
  extends BaseAbstractRepository<RegionModel> {
  list(request: GetListRegionQuery): Promise<ListRegionResponse>;
  import(bulkOps: any): Promise<any>;
}
