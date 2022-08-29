import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DetailRegionRequest extends BaseDto {
  @ApiProperty({ example: 'ABC123', description: 'Id của vùng' })
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
