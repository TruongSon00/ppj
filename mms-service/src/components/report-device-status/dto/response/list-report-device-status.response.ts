import { plus } from '@utils/common';
import { DEVICE_ASIGNMENTS_STATUS_ENUM } from '@components/device-assignment/device-assignment.constant';
import { Expose, Transform } from 'class-transformer';
import { isEmpty } from 'lodash';

export class ListReportDeviceStatusResponse {
  @Expose()
  @Transform((data) => data.obj._id)
  deviceId: string;

  @Expose()
  @Transform((data) => data.obj.code)
  devideCode: string;

  @Expose()
  @Transform((data) => data.obj.name)
  devideName: string;

  @Expose()
  @Transform((data) =>
    data.obj.deviceAssignments.reduce(
      (a: number, b: any) => plus(a, b?.count || 0),
      0,
    ),
  )
  totalQuantity: number;

  @Transform((v) => Number(v.value))
  @Expose()
  unUseQuantity: number;

  @Expose()
  @Transform((data) =>
    data.obj.deviceAssignments.reduce(
      (a: number, b: any) =>
        plus(
          a,
          !isEmpty(b?._id) &&
            b?._id?.status === DEVICE_ASIGNMENTS_STATUS_ENUM.IN_USE
            ? b?.count || 0
            : 0,
        ),
      0,
    ),
  )
  usingQuantity: number;

  @Expose()
  @Transform((data) =>
    data.obj.deviceAssignments.reduce(
      (a: number, b: any) =>
        plus(
          a,
          !isEmpty(b?._id) &&
            b?._id?.status === DEVICE_ASIGNMENTS_STATUS_ENUM.RETURNED
            ? b?.count || 0
            : 0,
        ),
      0,
    ),
  )
  returnedQuantity: number;

  @Expose()
  @Transform((data) =>
    data.obj.deviceAssignments.reduce(
      (a: number, b: any) =>
        plus(
          a,
          !isEmpty(b?._id) &&
            b?._id?.status === DEVICE_ASIGNMENTS_STATUS_ENUM.IN_MAINTAINING
            ? b?.count || 0
            : 0,
        ),
      0,
    ),
  )
  maintainQuantity: number;

  @Expose()
  @Transform((data) =>
    data.obj.deviceAssignments.reduce(
      (a: number, b: any) =>
        plus(
          a,
          !isEmpty(b?._id) &&
            b?._id?.status === DEVICE_ASIGNMENTS_STATUS_ENUM.IN_SCRAPPING
            ? b?.count || 0
            : 0,
        ),
      0,
    ),
  )
  scrapQuantity: number;
}
