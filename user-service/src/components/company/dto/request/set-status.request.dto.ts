import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';

export class SetStatusRequestDto extends BaseDto {
  @ApiProperty({ example: 1, description: 'id' })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({ example: 1, description: 'user id' })
  @IsNotEmpty()
  @IsInt()
  userId?: number;
}
