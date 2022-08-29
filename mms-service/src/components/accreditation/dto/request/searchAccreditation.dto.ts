import { BaseDto } from '@core/dto/base.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeAccreditation extends BaseDto {
  @IsString()
  @IsNotEmpty()
  key: string;
}
