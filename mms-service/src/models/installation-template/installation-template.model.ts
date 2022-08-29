import { BaseModel } from '@core/model/base.model';

export class InstallationTemplateDetail {
  title: string;
  description: string;
  isRequire: boolean;
}

export interface InstallationTemplate extends BaseModel {
  code: string;
  name: string;
  description: string;
  details: InstallationTemplateDetail[];
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
