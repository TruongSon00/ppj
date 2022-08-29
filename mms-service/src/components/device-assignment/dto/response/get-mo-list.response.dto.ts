import { Expose } from 'class-transformer';

export class GetMoList {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  planFrom: Date;

  @Expose()
  planTo: string;
}
