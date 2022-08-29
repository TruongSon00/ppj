import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Accreditation } from 'src/models/accreditation/accreditation.model';

export interface AccreditationRepositoryInterface
  extends BaseAbstractRepository<Accreditation> {
  createEntity(request: any): Accreditation;
  search(key: any): Promise<Accreditation[]>;
}
