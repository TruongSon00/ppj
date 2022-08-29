import { Expose } from 'class-transformer';
import { DetailErrorTypeResponse } from './detail-error-type.response';

export class ListErrorTypeResponse {
  @Expose()
  data: DetailErrorTypeResponse[];

  @Expose()
  count: number;
}
