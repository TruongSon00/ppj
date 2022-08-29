import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseResponseDto } from '@core/dto/base.response.dto';

export class GetDetailSupplyGroupResponseDto extends BaseResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  active: number;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
