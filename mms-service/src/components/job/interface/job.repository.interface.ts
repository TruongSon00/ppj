import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { Job } from 'src/models/job/job.model';
import { ExecuteJobRequestDto } from '../dto/request/execute-job.request.dto';
import { ChecklistJobRequestDto } from '@components/job/dto/request/checklist-job.request.dto';
import { JobRejectRequestDto } from '../dto/request/reject-job.request.dto';
import { JobImplementRequestDto } from '../dto/request/implement-job.request.dto';
import { ListJobByDeviceRequestDto } from '../dto/request/list-job-by-device.request.dto';
import { ApproveJobRequestDto } from '../dto/request/approve-job.request.dto';
import { RedoJobRequestDto } from '../dto/request/redo-check-list.request.dto';
import { ListJobProgressRequestDto } from '../dto/request/report-job-progress-list.request.dto';
import { Types } from 'mongoose';
import { ReportJobRequest } from '../dto/request/report-job.request.dto';
import { GetListJobByPlanIdRequestDto } from '../dto/request/get-list-job-in-plan.request';
export interface JobRepositoryInterface extends BaseInterfaceRepository<Job> {
  createJobEntity(data: any, getData?: boolean): Promise<any>;
  getListJob(
    payload,
    checkPermission?: boolean,
    userIdsInTeam?: string[],
    userIdsFilter?: string[],
    isTeamLead?: boolean,
    teamId?: string,
  ): Promise<any>;
  updateJobAssignment(payload: any): Promise<any>;
  updateJobExecute(job: any, payload: ExecuteJobRequestDto): Promise<any>;
  updateJobApprove(payload: ApproveJobRequestDto): Promise<any>;
  updateJobChecklist(payload: ChecklistJobRequestDto): Promise<any>;
  getDetailJob(id: string): Promise<any>;
  dashboardSummary(): Promise<any>;
  updateJobReject(payload: JobRejectRequestDto): Promise<any>;
  updateJobImplement(payload: JobImplementRequestDto): Promise<any>;
  listJobByDevice(
    params: ListJobByDeviceRequestDto,
    status?: number,
  ): Promise<any>;
  getJobByMaintainRequest(maintainRequestId: string): Promise<any>;
  updateJobRedo(
    payload: RedoJobRequestDto,
    isLateInProgress: boolean,
  ): Promise<any>;
  updateJobInprogress(payload: any): Promise<any>;
  reportTotalJob(): Promise<any>;
  reportNotCompleteJob(): Promise<any>;
  reportCompleteJob(): Promise<any>;
  reportProgressJob(startDate: Date, endDate: Date): Promise<any>;
  getListJobProgress(payload: ListJobProgressRequestDto): Promise<any>;
  getJobWithMttIndex(
    startDate: Date,
    endDate: Date,
    userIds: string[],
    maintainTeam: string,
    factory: number,
  ): Promise<any>;
  findByIdsAndDelete(ids: Types.ObjectId[]): Promise<void>;
  createManyJobEntity(data: any): Promise<any>;
  updateMultipleWithValues(bulkUpdate: any): Promise<any>;
  findAndPopulate(condition: any, populate: any): Promise<any>;
  reportJob(request: ReportJobRequest, assignIds: string[]): Promise<any[]>;
  reportJobDetail(assignIds: string[]): Promise<any[]>;
  listByPlanId(request: GetListJobByPlanIdRequestDto): Promise<any>;
}
