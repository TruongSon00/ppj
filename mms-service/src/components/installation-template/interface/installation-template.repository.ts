import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { InstallationTemplate } from 'src/models/installation-template/installation-template.model';
import { GetListInstallationTemplateQuery } from '../dto/query/get-list-installation-template.query';
import { CreateInstallationTemplateRequest } from '../dto/request/create-installation-template.request';
import { UpdateInstallationTemplateRequest } from '../dto/request/update-installation-template.request';
import { LisInstallationTemplateResponse } from '../dto/response/list-installation-template.response';

export interface InstallationTemplateRepositoryInterface
  extends BaseAbstractRepository<InstallationTemplate> {
  createDocument(
    request: CreateInstallationTemplateRequest,
  ): InstallationTemplate;
  updateEntity(
    entity: InstallationTemplate,
    request: UpdateInstallationTemplateRequest,
  ): InstallationTemplate;
  list(
    request: GetListInstallationTemplateQuery,
  ): Promise<LisInstallationTemplateResponse>;
}
