import { BaseDto } from '@core/dto/base.dto';
import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';

export class ChangeAccreditation extends BaseDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  @IsNotEmpty()
  active: boolean;
}
