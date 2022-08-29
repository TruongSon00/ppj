import { Expose, Transform, Type } from 'class-transformer';

class DetailSupplyRequest {
  @Expose()
  @Transform((v) => v.obj?.supplyId?._id.toString() || null)
  id: string;

  @Transform((v) => v.obj?.supplyId?.code || null)
  @Expose()
  code: string;

  @Transform((v) => v.obj?.supplyId?.name || null)
  @Expose()
  name: string;

  @Transform((v) => v.obj?.supplyId?.type || 0)
  @Expose()
  type: number;

  @Transform((v) => v?.value || null)
  @Expose()
  unit: string;

  @Transform((v) => v.obj?.supplyId?.price || 0)
  @Expose()
  price: number;

  @Expose()
  isManufacture: boolean;

  @Transform((v) => Number(v.value))
  @Expose()
  quantity: number;

  @Transform((v) => Number(v.value))
  @Expose()
  stockQuantity: number;

  @Transform((v) => Number(v.value))
  @Expose()
  planQuantity: number;

  @Transform((v) => Number(v.value))
  @Expose()
  buyQuantity: number;
}

export class DetailSuppyRequestResponse {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Transform((v) => v.obj?.jobId?._id.toString() || null)
  @Expose()
  jobId: string;

  @Transform((v) => v.obj?.jobId?.code || null)
  @Expose()
  jobCode: string;

  @Transform((v) => v.obj?.jobId?.name || null)
  @Expose()
  jobName: string;

  @Transform((v) => v.obj?.jobId?.type || null)
  @Expose()
  jobType: string;

  @Expose({ name: 'requestBy' })
  requestedBy: string;

  @Transform((v) => v.obj?.deviceAssignmentId?.serial || null)
  @Expose()
  serial: string;

  @Expose()
  team: string;

  @Transform((v) => v.obj?.deviceAssignmentId?.deviceId?.name || null)
  @Expose()
  deviceName: string;

  @Expose()
  receiveExpectedDate: string;

  @Expose()
  factory: string;

  @Expose()
  workCenter: string;

  @Expose()
  status: number;

  @Expose()
  @Transform((data) => data?.value ?? '')
  description: string;

  @Expose()
  histories: any[];

  @Type(() => DetailSupplyRequest)
  @Expose()
  supplies: DetailSupplyRequest[];
}
