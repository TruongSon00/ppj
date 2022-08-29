import { PermissionCode } from '@core/decorator/get-code.decorator';
import {
  Controller,
  Injectable,
  Get,
  Inject,
  Put,
  Body,
  Query,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CREATE_PLAN_PERMISSION,
  DELETE_PLAN_PERMISSION,
  DETAIL_PLAN_PERMISSION,
  LIST_PLAN_PERMISSION,
  UPDATE_PLAN_PERMISSION,
} from '@utils/permissions/plan';
import { SuccessResponse } from '@utils/success.response.dto';
import { isEmpty } from 'lodash';
import { GanttChartPlanQuery } from './dto/query/gantt-chart-plan.query';
import { CreatePlanRequestDto } from './dto/request/create-plan.request.dto';
import { DeletePlanRequestDto } from './dto/request/delete-plan.request';
import { GenerateJobForPlanRequest } from './dto/request/generate-job-for-plan.request';
import { GetListPlanQueryRequestDto } from './dto/request/get-list-plan.request.dto';
import { DetailPlanQueryDto } from './dto/request/get-plan-detail.request.dto';
import { UpdatePlanRequestBodyDto } from './dto/request/update-plan-status.request.dto';
import { UpdatePlanBodyDto } from './dto/request/update-plan.request.dto';
import { PlanDetailResponseDto } from './dto/response/plan-detail.response.dto';
import { PlanServiceInterface } from './interface/plan.service.interface';

@Injectable()
@Controller()
export class PlanController {
  constructor(
    @Inject('PlanServiceInterface')
    private readonly planService: PlanServiceInterface,
  ) {}

  // @MessagePattern('list_plans')
  @PermissionCode(LIST_PLAN_PERMISSION.code)
  @Get('plan/list')
  @ApiOperation({
    tags: ['List Plan'],
    summary: 'Danh sách kế hoạch tổng thể',
    description: 'Danh sách kế hoạch tổng thể',
  })
  @ApiResponse({
    status: 200,
    description: 'List successfully',
    type: null,
  })
  async listPlan(@Query() payload: GetListPlanQueryRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.planService.listPlan(request);
  }

  // @MessagePattern('update_plan_reject')
  @Put('plan/:id/reject')
  @ApiOperation({
    tags: ['Plans'],
    summary: 'Từ chối kế hoạch',
    description: 'Từ chối kế hoạch',
  })
  @ApiResponse({
    status: 200,
    description: 'Update Item',
    type: SuccessResponse,
  })
  async planReject(
    @Param('id') id: string,
    @Body() payload: UpdatePlanRequestBodyDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.id = id;
    return await this.planService.reject(request);
  }

  // @MessagePattern('update_plan_approve')
  @Put('plan/:id/approve')
  @ApiOperation({
    tags: ['Plans'],
    summary: 'Xác nhận kế hoạch',
    description: 'Xác nhận kế hoạch',
  })
  @ApiResponse({
    status: 200,
    description: 'Update Item',
    type: SuccessResponse,
  })
  async planApprove(
    @Param('id') id: string,
    @Body() payload: UpdatePlanRequestBodyDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.id = id;
    return await this.planService.approve(request);
  }

  // @MessagePattern('plan_detail')
  @PermissionCode(DETAIL_PLAN_PERMISSION.code)
  @Get('plan/:id')
  @ApiOperation({
    tags: ['Plans'],
    summary: 'Chi tiết kế hoạch',
    description: 'Chi tiết kế hoạch',
  })
  @ApiResponse({
    status: 200,
    description: 'Update Item',
    type: PlanDetailResponseDto,
  })
  async planDetail(
    @Param('id') id: string,
    @Query() payload: DetailPlanQueryDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.id = id;
    return await this.planService.planDetail(request);
  }

  // @MessagePattern('create_plan')
  @PermissionCode(CREATE_PLAN_PERMISSION.code)
  @Post('/plan')
  @ApiOperation({
    tags: ['Create plan'],
    summary: 'Tạo kế hoạch',
    description: 'Tạo kế hoạch',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async create(@Body() payload: CreatePlanRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.planService.create(request);
  }

  // @MessagePattern('update_plan')
  @PermissionCode(UPDATE_PLAN_PERMISSION.code)
  @Put('/plan/:id/update')
  @ApiOperation({
    tags: ['Update plan'],
    summary: 'Cập nhật kế hoạch',
    description: 'Cập nhật kế hoạch',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdatePlanBodyDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.id = id;
    return await this.planService.update(request);
  }

  // @MessagePattern('delete_plan')
  @PermissionCode(DELETE_PLAN_PERMISSION.code)
  @Delete('plan/:id')
  @ApiOperation({
    tags: ['Plans'],
    summary: 'Xóa kế hoạch',
    description: 'Xóa kế hoạch',
  })
  @ApiResponse({
    status: 200,
    type: SuccessResponse,
  })
  async delete(@Param() param: DeletePlanRequestDto): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.planService.delete(request);
  }

  // @MessagePattern('gantt_chart_plan')
  @Get('plan/gantt-chart')
  @ApiOperation({
    tags: ['Gantt chart plan'],
    summary: 'Biểu đồ kế hoạch',
    description: 'Biểu đồ kế hoạch',
  })
  @ApiResponse({
    status: 200,
    description: 'Get successfully',
    type: null,
  })
  async ganttChart(@Query() payload: GanttChartPlanQuery): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.planService.ganttChart(request);
  }

  // @MessagePattern('generate_job_for_plan')
  @Post('/plan/generate-job')
  @ApiOperation({
    tags: ['Generate job for plan'],
    summary: 'Gen công việc từ nhà máy hoặc xưởng',
    description: 'Gen công việc từ nhà máy hoặc xưởng',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: null,
  })
  async generateJobForPlan(
    @Body() payload: GenerateJobForPlanRequest,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.planService.generateJobForPlan(request);
  }
}
