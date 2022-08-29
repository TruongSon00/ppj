import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';

export class DashboardDeviceAssignmentRequestDto extends BaseDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  factoryId: number;
}
