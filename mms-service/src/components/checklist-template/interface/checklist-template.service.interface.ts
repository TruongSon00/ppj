import { ResponsePayload } from '@utils/response-payload';
import { DetailCheckListTemplateResponseDto } from '@components/checklist-template/dto/response/detail-checklist-template.response.dto';
import { GetListCheckListTemplateRequestDto } from '@components/checklist-template/dto/request/get-list-checklist-template.request.dto';
import { UpdateCheckListTemplateRequestDto } from '@components/checklist-template/dto/request/update-checklist-template.request.dto';
import { ExportCheckListTemplateRequestDto } from '@components/checklist-template/dto/request/export-checklist-template.request.dto';
import { DetailCheclistTemplateRequestDto } from '@components/checklist-template/dto/request/detail-checklist-template.request.dto';
import { DeleteCheclistTemplateRequestDto } from '@components/checklist-template/dto/request/delete-checklist-template.request.dto';

export interface CheckListTemplateServiceInterface {
  detail(
    request: DetailCheclistTemplateRequestDto,
  ): Promise<ResponsePayload<DetailCheckListTemplateResponseDto | any>>;
  create(request: any): Promise<any>;
  getList(request: GetListCheckListTemplateRequestDto): Promise<any>;
  delete(request: DeleteCheclistTemplateRequestDto): Promise<any>;
  update(request: UpdateCheckListTemplateRequestDto): Promise<any>;
  findOneByCode(code: string): Promise<any>;
  exportCheckListTemplate(
    request: ExportCheckListTemplateRequestDto,
  ): Promise<any>;
  createMany(
    data: any,
    userId: number,
  ): Promise<{ dataSuccess: any[]; dataError: any[] }>;
}
