import { Expose } from 'class-transformer';

export class GetListWarehouseByConditionsResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
