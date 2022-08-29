import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserWarehousResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  warehouseId: number;

  @ApiProperty()
  @Expose()
  name: string;
}
