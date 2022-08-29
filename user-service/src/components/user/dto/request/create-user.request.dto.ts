import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, IsInt } from 'class-validator';
import { UserRequestDtoAbstract } from '@components/user/dto/request/user.request.dto.abstract';

export class CreateUserRequestDto extends UserRequestDtoAbstract {
  @ApiProperty({ example: '123456789', description: 'password' })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @ApiProperty()
  @IsInt()
  userId: number;
}
