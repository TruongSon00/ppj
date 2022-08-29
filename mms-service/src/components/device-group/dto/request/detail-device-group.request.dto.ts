import { BaseDto } from '@core/dto/base.dto';
import { IsNotEmpty } from 'class-validator';

export class DetailDeviceGroupRequestDto extends BaseDto {
  @IsNotEmpty()
  id: string;
}
