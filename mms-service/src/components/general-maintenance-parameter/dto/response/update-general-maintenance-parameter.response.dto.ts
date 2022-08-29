import { BaseResponseDto } from '@core/dto/base.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UpdateGeneralMaintenanceParameterResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  time: number;
}
