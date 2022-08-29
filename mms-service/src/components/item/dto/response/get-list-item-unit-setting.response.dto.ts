import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetListItemUnitSettingResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: number;
}
