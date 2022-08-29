import { BaseDto } from '@core/dto/base.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DetailMaintenanceTeamRequestDto extends BaseDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
