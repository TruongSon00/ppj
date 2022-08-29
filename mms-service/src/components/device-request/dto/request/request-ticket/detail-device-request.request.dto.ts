import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';

export class DetailDeviceRequestRequestDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
