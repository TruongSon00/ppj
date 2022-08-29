import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from '@utils/success.response.dto';
import { Expose } from 'class-transformer';

export class GenerateQrCodeSerialResponse extends SuccessResponse {
  @ApiProperty({ example: 'something string' })
  @Expose()
  qrCode: string;
}
