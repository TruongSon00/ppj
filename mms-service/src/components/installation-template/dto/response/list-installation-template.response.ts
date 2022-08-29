import { Expose } from 'class-transformer';
import { InstallationTemplate } from 'src/models/installation-template/installation-template.model';

export class LisInstallationTemplateResponse {
  @Expose()
  data: InstallationTemplate[];

  @Expose()
  count: number;
}
