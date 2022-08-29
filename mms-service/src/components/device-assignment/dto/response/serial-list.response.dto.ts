import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponse } from '@utils/success.response.dto';
import { Expose } from 'class-transformer';

export class SerialList extends SuccessResponse {
  @ApiProperty({
    example: 'ABC',
    description: 'Số serial của thiết bị',
  })
  @Expose()
  serial: string;

  @ApiProperty({
    example: 'ABC',
    description: 'Mã thiết bị',
  })
  @Expose()
  code: string;

  @ApiProperty({
    example: 'ABC',
    description: 'Tên thiết bị',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'ABC',
    description: 'Người sử dụng',
  })
  @Expose()
  user: any;
}
