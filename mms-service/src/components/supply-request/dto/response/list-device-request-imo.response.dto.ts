import { Expose, Type } from 'class-transformer';

class ItemRequest {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  type: number;

  @Expose()
  planQuantity: number;

  @Expose()
  unit: any;
}

export class ListDeviceRequestImo {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  type: number;

  @Expose()
  planFrom: Date;

  @Expose()
  planTo: Date;

  @Expose()
  description: string;

  @Expose()
  createdAt?: Date;

  @Type(() => ItemRequest)
  @Expose()
  items: ItemRequest[];
}
