import { BaseDto } from '@core/dto/base.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DetailInstallationTemplateRequest extends BaseDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
