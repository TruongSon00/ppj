import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExportDefectRequestDto extends BaseDto {
  @ApiProperty()
  @Expose()
  @IsString({ each: true })
  @IsNotEmpty()
  _ids: string[];
}
