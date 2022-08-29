import { BaseDto } from '@core/dto/base.dto';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class GetHistorySupplyRequestRequest extends BaseDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
