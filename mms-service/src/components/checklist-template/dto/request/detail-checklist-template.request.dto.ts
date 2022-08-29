import { BaseDto } from '@core/dto/base.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DetailCheclistTemplateRequestDto extends BaseDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
