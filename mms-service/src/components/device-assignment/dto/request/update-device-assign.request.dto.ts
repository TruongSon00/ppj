import { DEVICE_ASIGNMENTS_STATUS_ENUM } from '@components/device-assignment/device-assignment.constant';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { DeviceAssignRequestDto } from './device-assign.request.dto';

export class UpdateDeviceAssignRequestBodyDto extends DeviceAssignRequestDto {
  @IsEnum(DEVICE_ASIGNMENTS_STATUS_ENUM)
  @IsOptional()
  status: number;

  @IsBoolean()
  @IsOptional()
  isReassign: boolean;
}
export class UpdateDeviceAssignRequestDto extends UpdateDeviceAssignRequestBodyDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
