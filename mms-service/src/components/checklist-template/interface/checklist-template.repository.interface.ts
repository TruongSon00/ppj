import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { GetListCheckListTemplateRequestDto } from '@components/checklist-template/dto/request/get-list-checklist-template.request.dto';
import { ChecklistTemplate } from 'src/models/checklist-template/checklist-template.model';

export interface CheckListTemplateRepositoryInterface
  extends BaseAbstractRepository<ChecklistTemplate> {
  createEntity(param: any): ChecklistTemplate;
  updateEntity(entity: ChecklistTemplate, request: any): ChecklistTemplate;
  getList(request: GetListCheckListTemplateRequestDto): Promise<any>;
  detail(id: string): Promise<any>;
  update(param: any): Promise<any>;
  delete(id: string): Promise<any>;
  getListCheckListTemplateByIds(ids: string[]): Promise<any>;
}
