import { ListGeneralMaintenanceParameterRequestDto } from '@components/general-maintenance-parameter/dto/request/list-general-maintenance-parameter.request.dto';
import { UpdateGeneralMaintenaceParameterRequestDto } from '@components/general-maintenance-parameter/dto/request/update-general-maintenace-parameter.request.dto';
import { CreateGeneralMaintenanceParameterRequestDto } from '@components/general-maintenance-parameter/dto/request/create-general-maintenance-parameter.request.dto';

export interface GeneralMaintenanceParameterServiceInterface {
  create(request: CreateGeneralMaintenanceParameterRequestDto): Promise<any>;
  getList(request: ListGeneralMaintenanceParameterRequestDto): Promise<any>;
  update(request: UpdateGeneralMaintenaceParameterRequestDto): Promise<any>;
}