import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from '@core/dto/base.dto';

export class InsertDataRequestDto extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  table: string;

  @ApiProperty()
  @IsNotEmpty()
  data: any;
}
