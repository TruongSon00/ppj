import { BaseDto } from '@core/dto/base.dto';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetListAllMaintenanceTeamAndUserRequestDto extends BaseDto {
  @IsNumber()
  @Transform((v) => Number(v.value))
  @IsOptional()
  isGetAll: number;
}
