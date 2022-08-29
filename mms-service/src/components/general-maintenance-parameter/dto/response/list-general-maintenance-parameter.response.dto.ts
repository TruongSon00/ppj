import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ListGeneralMaintenanceParameterResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  time: number;
}