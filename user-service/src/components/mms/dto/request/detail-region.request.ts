import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DetailRegionRequest {
  @ApiProperty({ example: 'ABC123', description: 'Id của vùng' })
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
