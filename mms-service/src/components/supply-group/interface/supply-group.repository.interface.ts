import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { SupplyGroup } from 'src/models/supply-group/supply-group.model';
import { GetListSupplyGroupRequestDto } from '@components/supply-group/dto/request/get-list-supply-group.request.dto';

export interface SupplyGroupRepositoryInterface
  extends BaseInterfaceRepository<SupplyGroup> {
  createDocument(param: any): SupplyGroup;
  getList(request: GetListSupplyGroupRequestDto): Promise<any>;
  updateEntity(entity: SupplyGroup, param: any): SupplyGroup;
  import(bulkOps: any): Promise<any>;
}
