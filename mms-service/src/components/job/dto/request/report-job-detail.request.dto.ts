import { BaseDto } from '@core/dto/base.dto';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class ReportJobDetailRequest extends BaseDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsNotEmpty()
  id: number;
}
