import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class GenerateSerialRequest extends BaseDto {
  @ApiProperty({
    description: 'Mã thiết bị',
    type: String,
  })
  @IsNotEmpty()
  @IsNotBlank()
  deviceCode: string;
}
