import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DetailInterRegionRequest extends BaseDto {
  @ApiProperty({ example: 'ABC123', description: 'Id của liên vùng' })
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
