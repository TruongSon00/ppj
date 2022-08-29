import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { CreateDeviceGroupRequestDto } from './create-device-group.request.dto';

export class UpdateDeviceGroupRequestBody extends CreateDeviceGroupRequestDto {}
export class UpdateDeviceGroupRequestDto extends CreateDeviceGroupRequestDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  id: string;
}
