import { BaseResponseDto } from '@core/dto/base.response.dto';
import { Expose } from 'class-transformer';

export class DetailInterRegionResponse extends BaseResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
