import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { Supply } from 'src/models/supply/supply.model';
import { GetListSupplyRequestDto } from '@components/supply/dto/request/get-list-supply.request.dto';

export interface SupplyRepositoryInterface
  extends BaseInterfaceRepository<Supply> {
  getList(request: GetListSupplyRequestDto): Promise<any>;
  detail(id): Promise<any>;
  checkCodeExists(code): Promise<any>;
  createDocument(param: any): Supply;
  update(param: any): Promise<any>;
  checkSupplyGroupExist(id: string): Promise<any>;
  delete(id: string): Promise<any>;
  getByIds(ids: string[]): Promise<any>;
  findMaintenanceTeam(id: string): Promise<any>;
  findSupplyConfirmed(): Promise<any>;
  getListSupplyByIds(ids: string[]): Promise<any>;
}
