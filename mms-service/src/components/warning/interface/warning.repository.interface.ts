import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { Warning } from 'src/models/warning/warning.model';
import { GetListWarningRequestDto } from '../dto/request/list-warning.request.dto';

export interface WarningRepositoryInterface
  extends BaseInterfaceRepository<Warning> {
  findOneWithRelations(payload): Promise<any>;
  dashboardWarning(startDate?: Date, endDate?: Date): Promise<any>;
  updateDetails(payload): Promise<any>;
  getListWarning(payload: GetListWarningRequestDto): Promise<any>;
  createWarning(payload): Promise<any>;
  createManyWarning(payload): Promise<any>;
}
