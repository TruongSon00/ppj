import { ReportTotalJobResponse } from '@components/job/dto/response/report-total-job.response.dto';
import {
  Body,
  Controller,
  Get,
  Inject,
  Injectable,
  Query,
  Req,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty } from 'lodash';
import { DashboardMttrMttaIndexQuery } from './dto/query/dashboard-mttr-mtta-index.query';
import { ReportProgressJobQuery } from './dto/query/report-progress-job.query';
import { ReportServiceInterface } from './interface/report.service.interface';

@Injectable()
@Controller()
export class ReportController {
  constructor(
    @Inject('ReportServiceInterface')
    private readonly reportService: ReportServiceInterface,
  ) {}

  // @MessagePattern('report_total_job')
  @Get('/report-total-job')
  @ApiOperation({
    tags: ['Report total job'],
    summary: 'Report total job',
    description: 'Report total job',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ReportTotalJobResponse,
  })
  async reportTotalJob(@Req() req: any): Promise<ResponsePayload<any>> {
    return await this.reportService.reportTotalJob();
  }

  // @MessagePattern('report_progress_job')
  @Get('/report-progress-job')
  @ApiOperation({
    tags: ['Report progress job'],
    summary: 'Report progress job',
    description: 'Tiến độ công việc bảo trì',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: null,
  })
  async reportProgressJob(
    @Query() payload: ReportProgressJobQuery,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.reportService.reportProgressJob(request);
  }

  // @MessagePattern('report_maintain_request')
  @Get('/report-maintain-request')
  @ApiOperation({
    tags: ['Report maintain request'],
    summary: 'Report maintain request',
    description: 'Trạng thái yêu cầu',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: null,
  })
  async reportMaintainRequest(
    @Query() payload: ReportProgressJobQuery,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.reportService.reportMaintainRequest(request);
  }

  // @MessagePattern('dashboard_mttr_mtta_index')
  @Get('dashboard/mttr-mtta-index')
  @ApiOperation({
    tags: ['Dashboard mttr mtta index'],
    summary: 'Dashboard mttr mtta index',
    description: 'Thông số mttr mtta',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: null,
  })
  async dashboardMttrMttaIndex(
    @Query() payload: DashboardMttrMttaIndexQuery,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.reportService.dashboardMttrMttaIndex(request);
  }
}
