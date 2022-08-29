import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserFactoryResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  factoryId: number;

  @ApiProperty()
  @Expose()
  name: string;
}
