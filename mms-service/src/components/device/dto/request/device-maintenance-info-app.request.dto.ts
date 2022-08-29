import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class DeviceMaintenanceInfoAppRequestDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsNotBlank()
  serial: string;
}
