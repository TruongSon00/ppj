import { BaseDto } from '@core/dto/base.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ActiveUnitPayload extends BaseDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
