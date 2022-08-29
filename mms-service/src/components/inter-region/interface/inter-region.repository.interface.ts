import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { InterRegionModel } from 'src/models/inter-region/inter-region.model';
import { GetListInterRegionQuery } from '../dto/request/get-list-inter-region.query';
import { ListInterRegionResponse } from '../dto/response/list-inter-region.response';

export interface InterRegionRepositoryInterface
  extends BaseAbstractRepository<InterRegionModel> {
  list(request: GetListInterRegionQuery): Promise<ListInterRegionResponse>;
  import(bulkOps: any): Promise<any>;
}
