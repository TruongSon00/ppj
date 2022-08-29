import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@core/dto/base.dto';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class ScanQrDeviceRequestDto extends BaseDto {
  @ApiProperty({
    description: 'QR Code',
  })
  @IsString()
  @IsNotEmpty()
  @IsNotBlank()
  qrCode: string;
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
