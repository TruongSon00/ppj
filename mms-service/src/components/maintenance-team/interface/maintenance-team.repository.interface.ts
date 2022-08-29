import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { MaintenanceTeam } from 'src/models/maintenance-team/maintenance-team.model';

export interface MaintenanceTeamRepositoryInterface
  extends BaseInterfaceRepository<MaintenanceTeam> {
  getList(payload): Promise<any>;
  detail(id: string): Promise<any>;
  createDocument(param: any): MaintenanceTeam;
  update(param: any): Promise<any>;
  findOneByUserId(id: number): Promise<MaintenanceTeam>;
  import(bulkOps: any): Promise<any>;
}
