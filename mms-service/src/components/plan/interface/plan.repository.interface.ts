import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { Plan } from 'src/models/plan/plan.model';
import { GanttChartPlanQuery } from '../dto/query/gantt-chart-plan.query';
import { CreatePlanRequestDto } from '../dto/request/create-plan.request.dto';
import { GetListPlanRequestDto } from '../dto/request/get-list-plan.request.dto';
import { DetailPlanRequestDto } from '../dto/request/get-plan-detail.request.dto';

export interface PlanRepositoryInterface extends BaseInterfaceRepository<Plan> {
  checkPlanDate(
    planFrom: Date,
    planTo: Date,
    id?: string,
    factoryId?: number,
    workCenterId?: number,
  ): Promise<any>;
  getDetail(request: DetailPlanRequestDto, id: number): Promise<any>;
  getList(request: GetListPlanRequestDto): Promise<any>;
  createDocument(request: CreatePlanRequestDto): Plan;
  ganttChart(request: GanttChartPlanQuery): Promise<any>;
}
