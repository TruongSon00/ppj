import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { DEVICE_REQUEST_ACTION } from '@components/device-request/device-request.constant';

export class UpdateStatusDeviceRequestRequestDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  id: string;

  @IsEnum(DEVICE_REQUEST_ACTION)
  @IsNotEmpty()
  action: string;
}
