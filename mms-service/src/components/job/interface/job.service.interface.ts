import { ResponsePayload } from '@utils/response-payload';
import { JobAssignmentRequestDto } from '../dto/request/job-assignment.request.dto';
import { ExecuteJobRequestDto } from '../dto/request/execute-job.request.dto';
import { ChecklistJobRequestDto } from '../dto/request/checklist-job.request.dto';
import { ApproveJobRequestDto } from '../dto/request/approve-job.request.dto';
import { JobRejectRequestDto } from '../dto/request/reject-job.request.dto';
import { JobImplementRequestDto } from '../dto/request/implement-job.request.dto';
import { RedoJobRequestDto } from '../dto/request/redo-check-list.request.dto';
import { InprogressJobRequestDto } from '../dto/request/inprogress-job.request.dto';
import { UpdateStatusJobRequestDto } from '../dto/request/update-status.job.request';
import { ListJobProgressRequestDto } from '../dto/request/report-job-progress-list.request.dto';
import { PaginationQuery } from '@utils/pagination.query';
import { ReportJobRequest } from '../dto/request/report-job.request.dto';
import { ReportJobDetailRequest } from '../dto/request/report-job-detail.request.dto';
import { GetListJobByPlanIdRequestDto } from '../dto/request/get-list-job-in-plan.request';

export interface JobServiceInterface {
  listJob(payload: any): Promise<ResponsePayload<any>>;
  updateAssignment(
    payload: JobAssignmentRequestDto,
  ): Promise<ResponsePayload<any>>;
  updateExecute(payload: ExecuteJobRequestDto): Promise<ResponsePayload<any>>;
  updateChecklist(
    payload: ChecklistJobRequestDto,
  ): Promise<ResponsePayload<any>>;
  updateApprove(payload: ApproveJobRequestDto): Promise<ResponsePayload<any>>;
  detail(id: string): Promise<ResponsePayload<any>>;
  updateReject(payload: JobRejectRequestDto): Promise<ResponsePayload<any>>;
  updateImplement(
    payload: JobImplementRequestDto,
  ): Promise<ResponsePayload<any>>;
  updateRedo(payload: RedoJobRequestDto): Promise<ResponsePayload<any>>;
  updateInprogress(
    payload: InprogressJobRequestDto,
  ): Promise<ResponsePayload<any>>;
  resolvedJob(
    payload: UpdateStatusJobRequestDto,
  ): Promise<ResponsePayload<any>>;
  reworkJob(payload: UpdateStatusJobRequestDto): Promise<ResponsePayload<any>>;
  jobProgressList(
    payload: ListJobProgressRequestDto,
  ): Promise<ResponsePayload<any>>;
  getListJobCreateSupplyRequest(payload: PaginationQuery): Promise<any>;
  detailJobDraft(id: string): Promise<ResponsePayload<any>>;
  reportJob(request: ReportJobRequest): Promise<ResponsePayload<any>>;
  reportJobDetail(
    request: ReportJobDetailRequest,
  ): Promise<ResponsePayload<any>>;
  listJobByPlan(
    request: GetListJobByPlanIdRequestDto,
  ): Promise<ResponsePayload<any>>;
  delete(id: string): Promise<ResponsePayload<any>>;
  deleteJobDraft(id: string): Promise<ResponsePayload<any>>;
}
