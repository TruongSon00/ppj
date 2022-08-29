import { Expose } from 'class-transformer';
import { DetailUnitResponse } from './detail-unit.response';

export class ListUnitResponse {
  @Expose()
  data: DetailUnitResponse[];

  @Expose()
  count: number;
}
