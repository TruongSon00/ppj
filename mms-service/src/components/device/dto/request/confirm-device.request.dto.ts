import { BaseDto } from '@core/dto/base.dto';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { Expose } from 'class-transformer';
import { IsNoSqlId } from '../../../../validator/is-nosql-id.validator';

export class ConfirmDeviceRequestDto extends BaseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  id: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  userId: number;
}
