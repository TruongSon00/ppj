import {
  Body,
  Controller,
  Get,
  Inject,
  Injectable,
  Query,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty } from 'lodash';
import { ListReportDeviceStatusQuery } from './dto/query/list-report-device-status.query';
import { ListReportDeviceAssignStatusQuery } from './dto/query/list-report-device-assign-status.query';
import { ReportDeviceStatusServiceInterface } from './interface/report-device-status.service.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ListReportDeviceStatusResponse } from './dto/response/list-report-device-status.response';
import { ListReportDeviceAssignStatusResponse } from './dto/response/list-report-device-assign-status.response';

@Injectable()
@Controller()
export class ReportDeviceStatusController {
  constructor(
    @Inject('ReportDeviceStatusServiceInterface')
    private readonly reportDeviceStatusService: ReportDeviceStatusServiceInterface,
  ) {}

  // @MessagePattern('list_report_device_status')
  @Get('/report-device-status')
  @ApiOperation({
    tags: ['Report device status'],
    summary: 'Báo cáo trạng thái thiết bị',
    description: 'Trạng thái thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ListReportDeviceStatusResponse,
  })
  async getListReportDeviceStatus(
    @Query() payload: ListReportDeviceStatusQuery,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.reportDeviceStatusService.getListReportDeviceStatus(
      request,
    );
  }

  // @MessagePattern('list_report_device_assign_status')
  @Get('/report-device-assign-status')
  @ApiOperation({
    tags: ['Report device assign status'],
    summary: 'Báo cáo trạng thái phân công thiết bị ',
    description: 'Trạng thái phân công thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ListReportDeviceAssignStatusResponse,
  })
  async getListReportDeviceAssignStatus(
    @Query() payload: ListReportDeviceAssignStatusQuery,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.reportDeviceStatusService.getListReportDeviceAssignStatus(
      request,
    );
  }
}
