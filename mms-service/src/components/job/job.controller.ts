import { PaginationQuery } from '@utils/pagination.query';
import {
  Controller,
  Injectable,
  Get,
  Inject,
  Put,
  Query,
  Param,
  Body,
  Delete,
} from '@nestjs/common';
import { JobServiceInterface } from './interface/job.service.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';
import { ListJobDataResponseDto } from './dto/response/list-job-data.response.dto';
import { ResponsePayload } from '@utils/response-payload';
import { GetListJobRequestDto } from './dto/request/get-list-job.request.dto';
import { isEmpty } from 'lodash';
import { JobAssignmentRequestDto } from './dto/request/job-assignment.request.dto';
import { SuccessResponse } from '@utils/success.response.dto';
import { ExecuteJobBody } from './dto/request/execute-job.request.dto';
import { CheckListJobBody } from './dto/request/checklist-job.request.dto';
import { ApproveJobParam } from './dto/request/approve-job.request.dto';
import { JobRejectParam } from './dto/request/reject-job.request.dto';
import { JobImplementParam } from './dto/request/implement-job.request.dto';
import { RedoJobRequestDto } from './dto/request/redo-check-list.request.dto';
import { InprogressJobRequestDto } from './dto/request/inprogress-job.request.dto';
import {
  UpdateStatusJobBodyDto,
  UpdateStatusJobRequestDto,
} from './dto/request/update-status.job.request';
import { ListJobProgressRequestDto } from './dto/request/report-job-progress-list.request.dto';
import { DetailJobDraftRequestDto } from './dto/request/detail-job-draft.request.dto';
import { IS_GET_ALL } from '@constant/common';
import { ReportJobRequest } from './dto/request/report-job.request.dto';
import { ReportJobDetailRequest } from './dto/request/report-job-detail.request.dto';
import { DetailJobQuery } from './dto/request/detail-job.query';
import { REPORT_DETAIL_JOB_PERMISSION } from '@utils/permissions/job';
import { PermissionCode } from '@core/decorator/get-code.decorator';
import { GetListJobByPlanIdRequestDto } from './dto/request/get-list-job-in-plan.request';

@Injectable()
@Controller('jobs')
export class JobController {
  constructor(
    @Inject('JobServiceInterface')
    private readonly jobService: JobServiceInterface,
  ) {}

  @Get('/list')
  @ApiOperation({
    tags: ['Jobs'],
    summary: 'List item',
    description: 'Danh sách công việc',
  })
  @ApiResponse({
    status: 200,
    description: 'List Item',
    type: ListJobDataResponseDto,
  })
  // @MessagePattern('list_jobs')
  async listJob(
    @Query() payload: GetListJobRequestDto,
  ): Promise<ResponsePayload<ListJobDataResponseDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.jobService.listJob(request);
  }

  @Get('/by-plan')
  @ApiOperation({
    tags: ['Jobs'],
    summary: 'List item',
    description: 'Danh sách công việc theo plan',
  })
  @ApiResponse({
    status: 200,
    description: 'List Item',
    type: ListJobDataResponseDto,
  })
  async listJobByPlan(
    @Query() payload: GetListJobByPlanIdRequestDto,
  ): Promise<ResponsePayload<ListJobDataResponseDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.jobService.listJobByPlan(request);
  }

  @Put('/:id/reject')
  @ApiOperation({
    tags: ['Jobs'],
    summary: 'Update item',
    description: 'Phân công công việc',
  })
  @ApiResponse({
    status: 200,
    description: 'Update Item',
    type: SuccessResponse,
  })
  // @MessagePattern('update_job_reject')
  async jobReject(@Param() param: JobRejectParam): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.jobService.updateReject(request);
  }

  @Put('/:id/implement')
  @ApiOperation({
    tags: ['Jobs'],
    summary: 'Update item',
    description: 'Thực hiện công việc',
  })
  @ApiResponse({
    status: 200,
    description: 'Update Item',
    type: SuccessResponse,
  })
  // @MessagePattern('update_job_implement')
  async jobImplement(@Param() param: JobImplementParam): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.jobService.updateImplement(request);
  }

  @Put('/:id/assignments')
  @ApiOperation({
    tags: ['Jobs'],
    summary: 'Update item',
    description: 'Phân công công việc',
  })
  @ApiResponse({
    status: 200,
    description: 'Update Item',
    type: SuccessResponse,
  })
  // @MessagePattern('update_job_assignment')
  async jobsAssignment(
    @Param('id') id: string,
    @Body() payload: JobAssignmentRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.id = id;
    return await this.jobService.updateAssignment(request);
  }

  @Put('/:id/execute')
  @ApiOperation({
    tags: ['Job', 'MMS'],
    summary: '',
    description: 'Thực thi công việc',
  })
  @ApiResponse({
    status: 200,
    description: 'Execute Job successfully',
    type: SuccessResponse,
  })
  // @MessagePattern('execute_job')
  async jobsExecute(
    @Param('id') id: string,
    @Body() payload: ExecuteJobBody,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.id = id;
    return await this.jobService.updateExecute(request);
  }

  @Put('/checklist/:id/execute')
  @ApiOperation({
    tags: ['Job', 'MMS'],
    summary: '',
    description: 'Kiểm tra định kì',
  })
  @ApiResponse({
    status: 200,
    description: 'Job update successfully',
    type: SuccessResponse,
  })
  // @MessagePattern('checklist_job')
  async jobsChecklist(
    @Param('id') id: string,
    @Body() payload: CheckListJobBody,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.id = id;
    return await this.jobService.updateChecklist(request);
  }

  @Put('/:id/approve')
  @ApiOperation({
    tags: ['Job', 'MMS'],
    summary: '',
    description: 'Hoàn thành công việc',
  })
  @ApiResponse({
    status: 200,
    description: 'Job Update successfully',
    type: SuccessResponse,
  })
  // @MessagePattern('approve_job')
  async jobsApprove(@Param() payload: ApproveJobParam): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.jobService.updateApprove(request);
  }

  @Put('/checklist/:id/redo')
  @ApiOperation({
    tags: ['Job', 'MMS'],
    summary: '',
    description: 'Làm lại công việc kiểm tra định kì',
  })
  @ApiResponse({
    status: 200,
    description: 'Job Update successfully',
    type: SuccessResponse,
  })
  // @MessagePattern('checklist_job_redo')
  async jobsRedo(@Param() param: RedoJobRequestDto): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.jobService.updateRedo(request);
  }

  @Put('/:id/in-progress')
  @ApiOperation({
    tags: ['Job', 'MMS'],
    summary: '',
    description: 'Đang thực hiện công việc',
  })
  @ApiResponse({
    status: 200,
    description: 'Job Update successfully',
    type: SuccessResponse,
  })
  // @MessagePattern('job_inprogress')
  async jobsInprogress(@Param() param: InprogressJobRequestDto): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.jobService.updateInprogress(request);
  }

  @Get('/:id')
  // @MessagePattern('detail_job')
  async detailJob(
    @Param('id') id: string,
    @Query() query: DetailJobQuery,
  ): Promise<ResponsePayload<ListJobDataResponseDto | any>> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    // const { isDraft } = request;
    // if (+isDraft === IS_GET_ALL.YES)
    //   return await this.jobService.detailJobDraft(id);
    return await this.jobService.detail(id);
  }

  @Delete('/:id')
  async delete(
    @Param('id') id: string,
  ): Promise<ResponsePayload<ListJobDataResponseDto | any>> {
    return await this.jobService.delete(id);
  }

  @Delete('/draft/:id')
  async deleteJobDraft(
    @Param('id') id: string,
  ): Promise<ResponsePayload<ListJobDataResponseDto | any>> {
    return await this.jobService.deleteJobDraft(id);
  }

  @Put('/:id/resolve')
  @ApiOperation({
    tags: ['Job', 'MMS'],
    summary: '',
    description: 'Hoàn thành công việc',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully',
    type: SuccessResponse,
  })
  // @MessagePattern('resolved_job')
  async completeJob(@Param() param: UpdateStatusJobRequestDto): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.jobService.resolvedJob(request);
  }

  @Put('/:id/rework')
  @ApiOperation({
    tags: ['Job', 'MMS'],
    summary: '',
    description: 'Làm lại công việc',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully',
    type: SuccessResponse,
  })
  // @MessagePattern('rework_job')
  async reworkJob(
    @Param('id') id: string,
    @Body() payload: UpdateStatusJobBodyDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.id = id;
    return await this.jobService.reworkJob(request);
  }

  // @MessagePattern('report_job_progress_list')
  @Get('/report-progress/list')
  @ApiOperation({
    tags: ['Jobs', 'MMS'],
    summary: '',
    description: 'Báo cáo tiến độ công việc',
  })
  @ApiResponse({
    status: 200,
    description: 'Report job progress successfully',
    type: ListJobDataResponseDto,
  })
  async reportJobProgressList(
    @Query() query: ListJobProgressRequestDto,
  ): Promise<any> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.jobService.jobProgressList(request);
  }

  // @MessagePattern('list_jobs_create_supply_request')
  @Get('/create-supply-request')
  @ApiOperation({
    tags: ['Jobs'],
    summary: 'List Job',
    description: 'Danh sách công việc cần tạo yêu cầu cấp vtpt',
  })
  @ApiResponse({
    status: 200,
    description: 'List Job',
    type: null,
  })
  async listJobCreateSupplyRequest(
    @Query() query: PaginationQuery,
  ): Promise<any> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.jobService.getListJobCreateSupplyRequest(request);
  }

  @MessagePattern('detail_job_draft')
  async detailJobDraft(payload: DetailJobDraftRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.jobService.detailJobDraft(request);
  }

  // @MessagePattern('report_job')
  @Get('/report')
  @ApiOperation({
    tags: ['Jobs'],
    summary: 'Report Job',
    description: 'Báo cáo tiến độ công việc',
  })
  @ApiResponse({
    status: 200,
    description: 'Báo cáo tiến độ công việc',
    type: null,
  })
  async reportJob(@Query() payload: ReportJobRequest): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.jobService.reportJob(request);
  }

  @PermissionCode(REPORT_DETAIL_JOB_PERMISSION.code)
  @Get('/report/:id')
  @ApiOperation({
    tags: ['Jobs'],
    summary: 'Detail report Job',
    description: 'Chi tiết báo cáo tiến độ công việc',
  })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết báo cáo tiến độ công việc',
    type: null,
  })
  // @MessagePattern('report_job_detail')
  async reportJobDetail(
    @Param() payload: ReportJobDetailRequest,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.jobService.reportJobDetail(request);
  }
}
