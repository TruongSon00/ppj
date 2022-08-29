import { BaseDto } from '@core/dto/base.dto';
import { IsOptional, IsString } from 'class-validator';
import { IsNotBlank } from 'src/validator/is-not-blank.validator';

export class ListSerialRequest extends BaseDto {
  @IsOptional()
  @IsString()
  @IsNotBlank()
  serial: string;
}
