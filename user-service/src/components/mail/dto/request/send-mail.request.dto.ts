import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@core/dto/base.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';

class Context {}

class BodyMail {
  @ApiProperty({ example: 'subject mail' })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({ example: './template-mail' })
  @IsNotEmpty()
  @IsString()
  template: string;

  @ApiProperty({ example: { code: 'abc' } })
  @IsOptional()
  context?: Context;
}

export class SendMailRequestDto extends BaseDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: {
      subject: 'subject mail',
      template: './template-mail',
      context: { code: 'abc' },
    },
  })
  @IsNotEmpty()
  body: BodyMail;
}
