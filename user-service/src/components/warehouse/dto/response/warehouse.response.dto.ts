import { Expose } from 'class-transformer';

export class WarehouseResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
