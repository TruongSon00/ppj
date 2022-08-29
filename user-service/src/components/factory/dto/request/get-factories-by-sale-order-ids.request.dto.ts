import { Transform } from 'class-transformer';
import { ArrayUnique, IsArray, IsNotEmpty } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';

export class GetFactoriesBySaleOrderIdsRequestDto extends BaseDto {
  @IsNotEmpty()
  @ArrayUnique()
  @IsArray()
  @Transform((data) => data.value.split(','))
  saleOrderIds: number[];
}
