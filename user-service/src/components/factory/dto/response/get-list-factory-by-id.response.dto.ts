import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetListFactoryByCompanyIdResponseDto {
  @ApiProperty({ example: 1, description: 'id' })
  @Expose()
  id: number;

  @ApiProperty({ example: 1, description: 'factory 1' })
  @Expose()
  name: string;
}
