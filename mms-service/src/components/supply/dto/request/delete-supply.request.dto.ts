import { BaseDto } from '@core/dto/base.dto';
import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteSupplyRequestDto extends BaseDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
