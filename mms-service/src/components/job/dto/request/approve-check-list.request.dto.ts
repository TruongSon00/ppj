import { BaseDto } from '@core/dto/base.dto';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ApproveChecklistRequestDto extends BaseDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  id: string;
}
