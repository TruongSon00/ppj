import { BaseDto } from '@core/dto/base.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { IsNoSqlId } from '../../../../validator/is-nosql-id.validator';

export class DeleteDeviceRequestDto extends BaseDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsNoSqlId()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
