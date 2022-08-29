import { DEVICE_CONST } from '@components/device/device.constant';
import { CreateDeviceRequestDto } from '@components/device/dto/request/create-device.request.dto';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { IsNoSqlId } from 'src/validator/is-nosql-id.validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class UpdateDeviceRequestBodyDto extends CreateDeviceRequestDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(DEVICE_CONST.CODE.MAX_LENGTH)
  @Matches(DEVICE_CONST.CODE.REGEX)
  @IsNotBlank()
  code: string;
}
export class UpdateDeviceRequestDto extends UpdateDeviceRequestBodyDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  id: string;
}
