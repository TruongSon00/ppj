import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessResponse } from '@utils/success.response.dto';
import { isEmpty } from 'lodash';
import { ListDeviceRequestImoQuery } from './dto/query/list-device-request-imo.query';
import { ListSupplyRequestQuery } from './dto/query/list-supply-request.query';
import { ApproveSupplyRequestRequest } from './dto/request/approve-supply-request.request';
import { ConfirmSupplyRequestRequest } from './dto/request/confirm-supply-request.request';
import { CreateSupplyRequest } from './dto/request/create-supply-request.request';
import { DetailSupplyRequestRequest } from './dto/request/detail-supply-request.request';
import { GetHistorySupplyRequestRequest } from './dto/request/get-history-supply-request.request';
import { RejectSupplyRequestRequest } from './dto/request/reject-supply-request.request';
import { UpdateActualQuantityRequest } from './dto/request/update-actual-quantity.request';
import {
  UpdateSupplyRequest,
  UpdateSupplyRequestBodyDto,
} from './dto/request/update-supply-request.request';
import { DetailSuppyRequestResponse } from './dto/response/detail-supply-request.response';
import { GetHistorySupplyResponse } from './dto/response/get-history-supply-request.response';
import { SupplyRequestServiceInterface } from './interface/supply-request.service.interface';

@Controller()
export class SupplyRequestController {
  constructor(
    @Inject('SupplyRequestServiceInterface')
    private readonly supplyRequestService: SupplyRequestServiceInterface,
  ) {}

  // @MessagePattern('create_supply_request')
  @Post('/supply-request')
  @ApiOperation({
    tags: ['Create supply request'],
    summary: 'Yêu cầu vật tư phụ tùng',
    description: 'Yêu cầu vật tư phụ tùng',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async create(@Body() payload: CreateSupplyRequest): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyRequestService.create(request);
  }

  // @MessagePattern('list_supply_request')
  @Get('/supply-request')
  @ApiOperation({
    tags: ['List supply request'],
    summary: 'Danh sách yêu cầu vật tư phụ tùng',
    description: 'Danh sách yêu cầu vật tư phụ tùng',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: null,
  })
  async list(@Query() payload: ListSupplyRequestQuery): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyRequestService.list(request);
  }

  // @MessagePattern('list_device_request_imo')
  @Get('/device-requests/list-imo')
  @ApiOperation({
    tags: ['Device request'],
    summary: 'Danh sách yêu cầu vật tư phụ tùng',
    description: 'Danh sách yêu cầu vật tư phụ tùng',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: null,
  })
  async listImo(@Query() payload: ListDeviceRequestImoQuery): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyRequestService.listImo(request);
  }

  // @MessagePattern('detail_device_request_imo')
  @Get('/device-requests/list-imo/:id')
  @ApiOperation({
    tags: ['Detail request'],
    summary: 'Chi tiết yêu cầu',
    description: 'Chi tiết yêu cầu',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async detailImo(@Param() param: DetailSupplyRequestRequest): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyRequestService.detailImo(request);
  }

  // @MessagePattern('delete_supply_request')
  @Delete('/supply-request/:id')
  @ApiOperation({
    tags: ['Delete supply request'],
    summary: 'Xóa yêu cầu vật tư phụ tùng',
    description: 'Xóa yêu cầu vật tư phụ tùng',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async delete(@Param() param: DetailSupplyRequestRequest): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyRequestService.delete(request);
  }

  // @MessagePattern('detail_supply_request')
  @Get('/supply-request/:id')
  @ApiOperation({
    tags: ['Detail supply request'],
    summary: 'Chi tiết yêu cầu vật tư phụ tùng',
    description: 'Chi tiết yêu cầu vật tư phụ tùng',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DetailSuppyRequestResponse,
  })
  async detail(@Param() param: DetailSupplyRequestRequest): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyRequestService.detail(request);
  }

  // @MessagePattern('reject_supply_request')
  @Put('/supply-request/:id/reject')
  @ApiOperation({
    tags: ['Reject supply request'],
    summary: 'Từ chối yêu cầu vật tư phụ tùng',
    description: 'Từ chối yêu cầu vật tư phụ tùng',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async reject(@Param() param: RejectSupplyRequestRequest): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyRequestService.reject(request);
  }

  // @MessagePattern('confirm_supply_request')
  @Put('/supply-request/:id/confirm')
  @ApiOperation({
    tags: ['Confirm supply request'],
    summary: 'Xác nhận yêu cầu vật tư phụ tùng',
    description: 'Xác nhận yêu cầu vật tư phụ tùng',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async confirm(@Param() param: ConfirmSupplyRequestRequest): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyRequestService.confirm(request);
  }

  @MessagePattern('approve_supply_request')
  async approve(@Body() payload: ApproveSupplyRequestRequest): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyRequestService.approve(request);
  }

  @MessagePattern('update_actual_export_item_request_quantity')
  async updateActualQuantity(
    @Body() payload: UpdateActualQuantityRequest,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyRequestService.updateActualQuantity(request);
  }

  // @MessagePattern('count_supply_in_request_by_job')
  @Get('/count-supply-in-request/:jobId')
  @ApiOperation({
    tags: ['Count supply in request by job'],
    summary: 'Đếm số lượng vật tư trong yêu cầu đã được nhận theo công việc',
    description:
      'Đếm số lượng vật tư trong yêu cầu đã được nhận theo công việc',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: null,
  })
  async countSupplyByJob(
    @Param('jobId') param: DetailSupplyRequestRequest,
  ): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyRequestService.countSupplyByJob(request);
  }

  // @MessagePattern('update_supply_request')
  @Put('/supply-request/:id')
  @ApiOperation({
    tags: ['Update supply request'],
    summary: 'Cập nhật yêu cầu vtpt',
    description: 'Cập nhật yêu cầu vtpt',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateSupplyRequestBodyDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.id = id;
    return await this.supplyRequestService.update(request);
  }

  // @MessagePattern('get_history_supply_request')
  @Get('/supply-request/:id/histories')
  @ApiOperation({
    tags: ['Supply request'],
    summary: 'lịch sử cầu vật tư phụ tùng',
    description: 'lịch sử yêu cầu vật tư phụ tùng',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GetHistorySupplyResponse,
  })
  async getHistory(
    @Param() param: GetHistorySupplyRequestRequest,
  ): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyRequestService.getHistory(request);
  }

  // TO DO: remove when refactor done
  @MessagePattern('detail_device_request_imo')
  async detailImoTcp(
    @Body() body: DetailSupplyRequestRequest
  ): Promise<any> {
    const { request, responseError } = body;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyRequestService.detailImo(request);
  }
}
