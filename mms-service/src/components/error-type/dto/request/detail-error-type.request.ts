import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DetailErrorTypeRequest extends BaseDto {
  @ApiProperty({ example: 'ABC123', description: 'Id của loại lỗi' })
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
