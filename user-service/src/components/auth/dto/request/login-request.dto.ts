import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { RememberPassword } from '@utils/common';

export class LoginRequestDto extends BaseDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(RememberPassword)
  rememberPassword: number;
}
