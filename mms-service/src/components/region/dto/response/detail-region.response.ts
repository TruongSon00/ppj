import { DetailInterRegionResponse } from '@components/inter-region/dto/response/detail-inter-region.response';
import { BaseResponseDto } from '@core/dto/base.response.dto';
import { Expose, Type } from 'class-transformer';

export class DetailRegionResponse extends BaseResponseDto {
  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Type(() => DetailInterRegionResponse)
  @Expose({ name: 'interRegion' })
  interRegion: DetailInterRegionResponse;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
