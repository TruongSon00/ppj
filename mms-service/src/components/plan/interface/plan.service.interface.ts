import { ResponsePayload } from '@utils/response-payload';
import { GanttChartPlanQuery } from '../dto/query/gantt-chart-plan.query';
import { CreatePlanRequestDto } from '../dto/request/create-plan.request.dto';
import { DeletePlanRequestDto } from '../dto/request/delete-plan.request';
import { GenerateJobForPlanRequest } from '../dto/request/generate-job-for-plan.request';
import { GetListPlanRequestDto } from '../dto/request/get-list-plan.request.dto';
import { DetailPlanRequestDto } from '../dto/request/get-plan-detail.request.dto';
import { UpdatePlanStatusRequestDto } from '../dto/request/update-plan-status.request.dto';
import { UpdatePlanRequestDto } from '../dto/request/update-plan.request.dto';

export interface PlanServiceInterface {
  planDetail(request: DetailPlanRequestDto): Promise<ResponsePayload<any>>;
  listPlan(request: GetListPlanRequestDto): Promise<ResponsePayload<any>>;
  reject(request: UpdatePlanStatusRequestDto): Promise<ResponsePayload<any>>;
  approve(request: UpdatePlanStatusRequestDto): Promise<ResponsePayload<any>>;
  create(request: CreatePlanRequestDto): Promise<ResponsePayload<any>>;
  update(request: UpdatePlanRequestDto): Promise<ResponsePayload<any>>;
  delete(request: DeletePlanRequestDto): Promise<ResponsePayload<any>>;
  ganttChart(request: GanttChartPlanQuery): Promise<ResponsePayload<any>>;
  generateJobForPlan(
    request: GenerateJobForPlanRequest,
  ): Promise<ResponsePayload<any>>;
}
