import { Expose, Type } from 'class-transformer';

class BaseClass {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  code: string;
}

export class GetWarehouseByUserResponseDto extends BaseClass {
  @Expose()
  @Type(() => BaseClass)
  factory: BaseClass;

  @Expose()
  @Type(() => BaseClass)
  warehouseTypes: BaseClass[];
}
