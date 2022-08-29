import { BaseDto } from '@core/dto/base.dto';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class GetMaintainRequestHistoriesDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
