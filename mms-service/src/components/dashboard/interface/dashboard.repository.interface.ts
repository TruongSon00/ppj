import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { Defect } from 'src/models/defect/defect.model';

export interface DefectRepositoryInterface
  extends BaseInterfaceRepository<Defect> {
}
