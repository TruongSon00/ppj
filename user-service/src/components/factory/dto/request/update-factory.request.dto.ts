import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateFactoryRequestDto } from './create-factory.request.dto';

export class UpdateFactoryBodyRequestDto extends CreateFactoryRequestDto {}
export class UpdateFactoryRequestDto extends UpdateFactoryBodyRequestDto {
  @ApiProperty({ example: 1, description: 'factory id' })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
