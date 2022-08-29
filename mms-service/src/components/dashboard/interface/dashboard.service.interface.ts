import { ResponsePayload } from '@utils/response-payload';
import { GetDashboardDeviceStatusRequestDto } from '../dto/request/dashboard-device-status.request.dto';

export interface DashboardServiceInterface {
  dashboardSummary(): Promise<ResponsePayload<any>>;
  dashboardDeviceAssignment(payload): Promise<ResponsePayload<any>>;
  dashboardWarning(request): Promise<ResponsePayload<any>>;
  dashboardDeviceStatus(
    request: GetDashboardDeviceStatusRequestDto,
  ): Promise<ResponsePayload<any>>;
}
