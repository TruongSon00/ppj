import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CheckListTemplateDetailResponseDto {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  obligatory: number;

  @ApiProperty()
  @Expose()
  subtitle: string;

  @ApiProperty()
  @Expose()
  status: number;
}
