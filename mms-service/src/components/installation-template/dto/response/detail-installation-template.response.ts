import { BaseDto } from '@core/dto/base.dto';
import { Expose, Type } from 'class-transformer';

class DetailInstallationTemplateDetail {
  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  isRequire: boolean;
}

export class DetailInstallationTemplateResponse extends BaseDto {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;

  @Type(() => DetailInstallationTemplateDetail)
  @Expose()
  details: DetailInstallationTemplateDetail[];
}
