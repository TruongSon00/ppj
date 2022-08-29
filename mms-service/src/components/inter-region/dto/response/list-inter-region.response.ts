import { Expose } from 'class-transformer';
import { DetailInterRegionResponse } from './detail-inter-region.response';

export class ListInterRegionResponse {
  @Expose()
  data: DetailInterRegionResponse[];

  @Expose()
  count: number;
}
