import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class ValidateSerialRequest extends BaseDto {
  @ApiProperty({
    description: 'Mã serial',
    type: String,
  })
  @IsNotEmpty()
  @IsNotBlank()
  serial: string;
}
