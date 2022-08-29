import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export class MaintenanceHistoryResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  executionDateTo: Date;

  @ApiProperty()
  @Expose()
  maintenanceTypes: number;
}
