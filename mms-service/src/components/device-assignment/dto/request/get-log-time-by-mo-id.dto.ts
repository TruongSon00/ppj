import { BaseDto } from '@core/dto/base.dto';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class GetLogTimeByMoId extends BaseDto {
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => Number(value))
  wcId: number;

  @IsNotEmpty()
  @IsString()
  moIds: string;
}
