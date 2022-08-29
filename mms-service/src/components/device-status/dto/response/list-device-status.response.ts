import { Expose, Transform } from 'class-transformer';

export class ListDeviceStatusResponse {
  @Expose({
    name: '_id',
  })
  @Transform((value) => {
    return value.obj._id?.toString();
  })
  deviceAssignmentId: string;

  @Expose()
  serial: string;

  @Transform((v) => v.obj.device[0]?.name || null)
  @Expose()
  deviceName: string;

  @Transform(
    (v) => v.obj?.deviceStatuses[0]?.status || v.obj?.deviceStatus || null,
  )
  @Expose()
  status: number;

  @Transform((v) =>
    v.obj?.deviceStatuses[0]?.oee !== null
      ? v.obj?.deviceStatuses[0]?.oee
      : null,
  )
  @Expose()
  oee: number;

  @Transform((v) => v.obj?.deviceStatuses[0]?.date || null)
  @Expose()
  date: Date;

  @Transform((v) =>
    v.obj?.deviceStatuses[0]?.timeRest !== null
      ? v.obj?.deviceStatuses[0]?.timeRest
      : null,
  )
  @Expose()
  timeRest: number;

  @Transform((v) =>
    v.obj?.deviceStatuses[0]?.timeAction !== null
      ? v.obj?.deviceStatuses[0]?.timeAction
      : null,
  )
  @Expose()
  timeAction: number;

  @Transform((v) =>
    v.obj?.deviceStatuses[0]?.numOfStop !== null
      ? v.obj?.deviceStatuses[0]?.numOfStop
      : null,
  )
  @Expose()
  numOfStop: number;

  @Transform((v) =>
    v.obj?.deviceStatuses[0]?.passQuantity !== null
      ? v.obj?.deviceStatuses[0]?.passQuantity
      : null,
  )
  @Expose()
  passedDevice: number;

  @Transform((v) =>
    v.obj?.deviceStatuses[0]?.actualQuantity !== null
      ? v.obj?.deviceStatuses[0]?.actualQuantity
      : null,
  )
  @Expose()
  manufacturedDevice: number;
}
