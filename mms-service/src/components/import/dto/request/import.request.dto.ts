import { BaseDto } from '@core/dto/base.dto';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ImportRequestDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsNotEmpty()
  fileData: ArrayBuffer;

  @IsInt()
  @IsNotEmpty()
  historyUserId: number;
}
