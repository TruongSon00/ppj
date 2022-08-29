import { ApiProperty } from '@nestjs/swagger';
import { UserRequestDtoAbstract } from '@components/user/dto/request/user.request.dto.abstract';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateUserRequestDto extends UserRequestDtoAbstract {
  @ApiProperty({ example: 'example@gmail.com', description: 'email' })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({ example: '0789-789-7890', description: 'phone' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone: string;
}
