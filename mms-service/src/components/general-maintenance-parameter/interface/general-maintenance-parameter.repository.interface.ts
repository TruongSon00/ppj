import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { GeneralMaintenanceParameter } from '../../../models/general-maintenance-parameter/general-maintenance-parameter.model';
import { ListGeneralMaintenanceParameterRequestDto } from '@components/general-maintenance-parameter/dto/request/list-general-maintenance-parameter.request.dto';

export interface GeneralMaintenanceParameterRepositoryInterface
  extends BaseAbstractRepository<GeneralMaintenanceParameter> {
  createDocument(param: any): GeneralMaintenanceParameter;
  update(param: any): Promise<any>;
}