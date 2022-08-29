import { BaseDto } from '@core/dto/base.dto';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class GetDashboardDeviceStatusRequestDto extends BaseDto {
  @IsNumber()
  @Transform((v) => Number(v.value))
  @IsOptional()
  factoryId: number;

  @IsString()
  @IsOptional()
  moId: number;
}
