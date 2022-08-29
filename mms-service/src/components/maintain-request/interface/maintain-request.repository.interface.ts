import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { MaintainRequest } from 'src/models/maintain-request/maintain-request.model';
import { CreateMaintainRequestDto } from '../dto/request/create-maintain-request.request.dto';
import { GetMaintainRequestByAssignDeviceRequest } from '../dto/request/get-maintain-request-by-assign-device.request.dto';
import { ListMaintainRequestDto } from '../dto/request/list-maintain-request.request.dto';

export interface MaintainRequestRepositoryInterface
  extends BaseInterfaceRepository<MaintainRequest> {
  save(payload: CreateMaintainRequestDto): Promise<any>;
  getAll(request: ListMaintainRequestDto): Promise<any>;
  getDetail(id: string): Promise<any>;
  getMaintainRequestByAssignDevice(
    request: GetMaintainRequestByAssignDeviceRequest,
  ): Promise<{ data: any[]; total: number }>;
  reportMaintainRequest(startDate: Date, endDate: Date): Promise<any>;
  createMaintenanceRequest(payload: CreateMaintainRequestDto): Promise<any>;
  dashboardMaintainRequest(startDate: Date, endDate: Date): Promise<any>;
}
