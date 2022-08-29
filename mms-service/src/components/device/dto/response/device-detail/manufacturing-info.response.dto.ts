import { Expose } from 'class-transformer';

export class ShiftDetailDto {
  @Expose()
  workTime: number;

  @Expose()
  relaxTime: number;
}

export class ShiftDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  date: string;

  @Expose()
  shiftDetail: ShiftDetailDto;
}

export class WorkOrderDto {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  dateFrom: string;

  @Expose()
  dateTo: string;

  @Expose()
  shifts: ShiftDto[];
}

export class ManufacturingOrderDto {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  workOrders: WorkOrderDto[];
}

export class WorkCenterDto {
  @Expose()
  id: number;

  @Expose()
  code: string;

  @Expose()
  name: string;
}

export class ManufacturingInfoResponseDto {
  @Expose()
  workCenter: WorkCenterDto;

  @Expose()
  oeeIndex: string;

  @Expose()
  manufacturingOrder: ManufacturingOrderDto;
}
