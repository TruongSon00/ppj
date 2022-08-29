import { ResponsePayload } from '@utils/response-payload';
import { ListReportDeviceStatusQuery } from '../dto/query/list-report-device-status.query';
import { ListReportDeviceAssignStatusQuery } from '../dto/query/list-report-device-assign-status.query';

export interface ReportDeviceStatusServiceInterface {
  getListReportDeviceStatus(
    request: ListReportDeviceStatusQuery,
  ): Promise<ResponsePayload<any>>;
  getListReportDeviceAssignStatus(
    request: ListReportDeviceAssignStatusQuery,
  ): Promise<ResponsePayload<any>>;
}
