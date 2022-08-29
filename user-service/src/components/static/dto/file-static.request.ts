import { BaseDto } from '@core/dto/base.dto';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { FILE_NAME_ENUM } from '@constant/import.constant';
export class FileStaticRequest extends BaseDto {
  @IsNotEmpty()
  @IsEnum(FILE_NAME_ENUM)
  fileName: number;
}
