import { Query, Controller, Injectable, Get, Inject } from '@nestjs/common';
import { DashboardServiceInterface } from './interface/dashboard.service.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardSummaryResponseDto } from './dto/response/summary.response.dto';
import { DashboardDeviceAssignmentStatusDataResponseDto } from './dto/response/device-assignment-status.response.dto';
import { DashboardDeviceAssignmentRequestDto } from './dto/request/dashboard-device-assignment.request.dto';
import { isEmpty } from 'lodash';
import { DashboardWarningRequestDto } from './dto/request/dashboard-warning.request.dto';
import { GetDashboardDeviceStatusRequestDto } from './dto/request/dashboard-device-status.request.dto';
import { DashboardWarningResponseDto } from './dto/response/dashboard-warning.response.dto';
import { DashboardDeviceStatusResponseDto } from './dto/response/dashboard-device-status.response.dto';

@Injectable()
@Controller()
export class DashboardController {
  constructor(
    @Inject('DashboardServiceInterface')
    private readonly dashboardService: DashboardServiceInterface,
  ) {}

  @Get('dashboard/summary')
  @ApiOperation({
    tags: ['Dashboard', 'MMS'],
    summary: 'Dashboard summary',
    description: 'thông tin thống kê tổng',
  })
  @ApiResponse({
    status: 200,
    description: 'Get successfully',
    type: DashboardSummaryResponseDto,
  })
  //@MessagePattern('dashboard_summary')
  async dashboardSummary(): Promise<any> {
    return await this.dashboardService.dashboardSummary();
  }

  @Get('/dashboards/device-assignments/status')
  @ApiOperation({
    tags: ['Dashboard', 'MMS'],
    summary: 'Dashboard summary',
    description: 'thông tin thống kê tổng',
  })
  @ApiResponse({
    status: 200,
    description: 'Get successfully',
    type: DashboardDeviceAssignmentStatusDataResponseDto,
  })
  //@MessagePattern('dashboard_device_assignment_status')
  async dashboardDeviceAssignment(
    @Query() query: DashboardDeviceAssignmentRequestDto,
  ): Promise<any> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.dashboardService.dashboardDeviceAssignment(request);
  }

  //@MessagePattern('dashboard_warning')
  @Get('dashboard/warning')
  @ApiOperation({
    tags: ['Dashboard warning'],
    summary: 'Dashboard warning',
    description: 'Dashboard warning',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: [DashboardWarningResponseDto],
  })
  async dashboardWarning(
    @Query() payload: DashboardWarningRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.dashboardService.dashboardWarning(request);
  }

  //@MessagePattern('dashboard_device_status')
  @Get('dashboard/device-status')
  @ApiOperation({
    tags: ['Dashboard device status'],
    summary: 'Dashboard trạng thái vận hành thiết bị',
    description: 'Trạng thái vận hành thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DashboardDeviceStatusResponseDto,
  })
  async dashboardDeviceStatus(
    @Query() payload: GetDashboardDeviceStatusRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.dashboardService.dashboardDeviceStatus(request);
  }
}
