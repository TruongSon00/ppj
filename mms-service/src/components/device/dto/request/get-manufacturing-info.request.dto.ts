import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsInt } from 'class-validator';

export class GetManufacturingInfoRequestDto {
  @ApiProperty()
  @Expose()
  @IsInt()
  workCenter: number;

  @ApiProperty()
  @Expose()
  @IsDateString()
  dateFrom: string;

  @ApiProperty()
  @Expose()
  @IsDateString()
  dateTo: string;
}
