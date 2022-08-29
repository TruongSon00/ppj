import { Expose } from 'class-transformer';
import { DetailRegionResponse } from './detail-region.response';

export class ListRegionResponse {
  @Expose()
  data: DetailRegionResponse[];

  @Expose()
  count: number;
}
