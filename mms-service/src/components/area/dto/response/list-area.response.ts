import { Expose } from 'class-transformer';
import { DetailAreaResponse } from './detail-area.response';

export class ListAreaResponse {
  @Expose()
  data: DetailAreaResponse[];

  @Expose()
  count: number;
}
