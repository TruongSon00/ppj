import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { MaintenanceAttribute } from '../../../models/maintenance-attribute/maintenance-attribute.model';

export interface MaintenanceAttributeRepositoryInterface
  extends BaseInterfaceRepository<MaintenanceAttribute> {
  getList(payload): Promise<any>;
  detail(id: string): Promise<any>;
  createDocument(param: any): MaintenanceAttribute;
  update(param: any): Promise<any>;
  delete(id: string): Promise<any>;
  findOneByCode(code: string): Promise<any>;
}
