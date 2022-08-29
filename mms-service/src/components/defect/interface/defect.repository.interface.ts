import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { Defect } from 'src/models/defect/defect.model';
import { GetListDefectRequestDto } from '@components/defect/dto/request/get-list-defect.request.dto';

export interface DefectRepositoryInterface
  extends BaseInterfaceRepository<Defect> {
  createDocument(param: any): Defect;
  createEntity(param: any): Defect;
  checkCodeExist(code: string): Promise<any>;
  getList(request: GetListDefectRequestDto): Promise<any>;
  detail(id: string): Promise<any>;
  update(param: any): Promise<any>;
  delete(id: string): Promise<any>;
  getListDefectByIds(ids: string[]): Promise<any>;
}
