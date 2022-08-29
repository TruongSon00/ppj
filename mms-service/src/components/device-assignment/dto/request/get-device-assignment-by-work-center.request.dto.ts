import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class GetDeviceAssignmentByWorkCenterId extends BaseDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  workCenterId: number;
}
