import { BaseDto } from '@core/dto/base.dto';
import { IsNotEmpty } from 'class-validator';

export class DeleteMaintenanceAttributeRequestDto extends BaseDto {
  @IsNotEmpty()
  id: string;
}
