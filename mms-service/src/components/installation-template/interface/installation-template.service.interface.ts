import { ResponsePayload } from '@utils/response-payload';
import { GetListInstallationTemplateQuery } from '../dto/query/get-list-installation-template.query';
import { CreateInstallationTemplateRequest } from '../dto/request/create-installation-template.request';
import { DetailInstallationTemplateRequest } from '../dto/request/detail-installation-template.request';
import { UpdateInstallationTemplateRequest } from '../dto/request/update-installation-template.request';

export interface InstallationTemplateServiceInterface {
  create(
    request: CreateInstallationTemplateRequest,
  ): Promise<ResponsePayload<any>>;
  detail(
    request: DetailInstallationTemplateRequest,
  ): Promise<ResponsePayload<any>>;
  delete(
    request: DetailInstallationTemplateRequest,
  ): Promise<ResponsePayload<any>>;
  update(
    request: UpdateInstallationTemplateRequest,
  ): Promise<ResponsePayload<any>>;
  list(
    request: GetListInstallationTemplateQuery,
  ): Promise<ResponsePayload<any>>;
  createMany(data: any): Promise<{ dataSuccess: any[]; dataError: any[] }>;
}
