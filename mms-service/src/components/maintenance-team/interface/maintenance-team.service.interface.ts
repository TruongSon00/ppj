import { GetListMaintenaceTeamRequestDto } from '@components/maintenance-team/dto/request/get-list-maintenace-team.request.dto';
import { UpdateMaintenanceTeamRequestDto } from '@components/maintenance-team/dto/request/update-maintenance-team.request.dto';
import { GetListAllMaintenanceTeamAndUserRequestDto } from '@components/maintenance-team/dto/request/get-list-all-maintenance-team-and-user.request.dto';
import { DetailMaintenanceTeamRequestDto } from '../dto/request/detail-maintenance-team.request.dto';
import { UpdateUnitActiveStatusPayload } from '@components/unit/dto/request/update-unit-status.request';

export interface MaintenanceTeamServiceInterface {
  create(payload: any): Promise<any>;
  list(request: GetListMaintenaceTeamRequestDto): Promise<any>;
  detail(request: DetailMaintenanceTeamRequestDto): Promise<any>;
  update(request: UpdateMaintenanceTeamRequestDto): Promise<any>;
  getListAllUserAndAllMaintenanceTeam(
    request: GetListAllMaintenanceTeamAndUserRequestDto,
  ): Promise<any>;
  createMany(request: any): Promise<any>;
  updateStatus(request: UpdateUnitActiveStatusPayload): Promise<any>;
}
