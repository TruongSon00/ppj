import { BaseModel } from '@core/model/base.model';
import { MaintenanceTeamMember } from '../maintenance-team-member/maintenance-team-member.model';

export interface MaintenanceTeam extends BaseModel {
  code: string;
  name: string;
  description: string;
  members: MaintenanceTeamMember[];
  active: number;
}
