import { ResponsePayload } from '@utils/response-payload';
import { DashboardMttrMttaIndexQuery } from '../dto/query/dashboard-mttr-mtta-index.query';
import { ReportProgressJobQuery } from '../dto/query/report-progress-job.query';

export interface ReportServiceInterface {
  reportTotalJob(): Promise<ResponsePayload<any>>;
  reportProgressJob(
    request: ReportProgressJobQuery,
  ): Promise<ResponsePayload<any>>;
  reportMaintainRequest(
    request: ReportProgressJobQuery,
  ): Promise<ResponsePayload<any>>;
  dashboardMttrMttaIndex(
    request: DashboardMttrMttaIndexQuery,
  ): Promise<ResponsePayload<any>>;
}
