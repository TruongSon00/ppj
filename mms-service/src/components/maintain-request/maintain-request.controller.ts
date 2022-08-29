import { PermissionCode } from '@core/decorator/get-code.decorator';
import {
  Controller,
  Injectable,
  Inject,
  Put,
  Delete,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  APPROVE_MAINTAIN_REQUEST_PERMISSION,
  COMPLETED_MAINTAIN_REQUEST_PERMISSION,
  CREATE_MAINTAIN_REQUEST_PERMISSION,
  DESTROY_MAINTAIN_REQUEST_PERMISSION,
  DETAIL_MAINTAIN_REQUEST_PERMISSION,
  LIST_MAINTAIN_REQUEST_PERMISSION,
  REDO_MAINTAIN_REQUEST_PERMISSION,
  REJECT_MAINTAIN_REQUEST_PERMISSION,
  UPDATE_MAINTAIN_REQUEST_PERMISSION,
} from '@utils/permissions/maintain-request';
import { SuccessResponse } from '@utils/success.response.dto';
import { isEmpty } from 'lodash';
import { CreateMaintainRequestDto } from './dto/request/create-maintain-request.request.dto';
import { DeleteMaintainRequestDto } from './dto/request/delete-maintain-request.request.dto';
import { GetMaintainRequestByAssignDeviceRequest } from './dto/request/get-maintain-request-by-assign-device.request.dto';
import { GetMaintainRequestHistoriesDto } from './dto/request/get-maintain-request-history.request.dto';
import { ListMaintainRequestDto } from './dto/request/list-maintain-request.request.dto';
import { UpdateMaintainBodyDto } from './dto/request/update-main-request.request.dto';
import {
  UpdateMaintainRequestStatusDto,
  UpdateMaintainStatusBodyDto,
} from './dto/request/update-status-maintain-request.request.dto';
import { GetMaintainRequestByAssignDeviceResponse } from './dto/response/get-maintain-request-by-assign-device.response.dto';
import { MaintainRequestHistoriesResponseDto } from './dto/response/maintain-request-histories.response.dto';
import { MaintainRequestServiceInterface } from './interface/maintain-request.service.interface';

@Injectable()
@Controller()
export class MaintainRequestController {
  constructor(
    @Inject('MaintainRequestServiceInterface')
    private readonly maintainRequestService: MaintainRequestServiceInterface,
  ) {}

  // @MessagePattern('create_maintain_request')
  @PermissionCode(CREATE_MAINTAIN_REQUEST_PERMISSION.code)
  @Post('/maintain-requests')
  @ApiOperation({
    tags: ['MaintainRequest', 'MMS'],
    summary: '',
    description: 'Tạo yêu cầu bảo trì',
  })
  @ApiResponse({
    status: 200,
    description: 'Create successfully',
    type: null,
  })
  async createMaintainRequest(
    @Body() payload: CreateMaintainRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.maintainRequestService.create(request);
  }

  @PermissionCode(UPDATE_MAINTAIN_REQUEST_PERMISSION.code)
  @Put('/maintain-requests/:id')
  @ApiOperation({
    tags: ['MaintainRequest', 'MMS'],
    summary: '',
    description: 'Cập nhật yêu cầu bảo trì',
  })
  @ApiResponse({
    status: 200,
    description: 'Update successfully',
    type: SuccessResponse,
  })
  // @MessagePattern('update_maintain_request')
  async updateMaintainRequest(
    @Param('id') id: string,
    @Body() payload: UpdateMaintainBodyDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    request.id = id;
    return await this.maintainRequestService.update(request);
  }

  // @MessagePattern('destroy_maintain_request')
  @PermissionCode(DESTROY_MAINTAIN_REQUEST_PERMISSION.code)
  @Delete('/maintain-requests/:id')
  @ApiOperation({
    tags: ['MaintainRequest', 'MMS'],
    summary: '',
    description: 'Xóa yêu cầu bảo trì',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete successfully',
    type: SuccessResponse,
  })
  async destroyMaintainRequest(
    @Param() param: DeleteMaintainRequestDto,
  ): Promise<any> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.maintainRequestService.delete(request.id);
  }

  // @MessagePattern('approve_maintain_request')
  @PermissionCode(APPROVE_MAINTAIN_REQUEST_PERMISSION.code)
  @Put('/maintain-requests/:id/approve')
  @ApiOperation({
    tags: ['MaintainRequest', 'MMS'],
    summary: '',
    description: 'Phê duyệt yêu cầu bảo trì',
  })
  @ApiResponse({
    status: 200,
    description: 'Approve successfully',
    type: SuccessResponse,
  })
  async approveMaintainRequest(
    @Param() param: UpdateMaintainRequestStatusDto,
  ): Promise<any> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.maintainRequestService.approve(request);
  }

  // @MessagePattern('reject_maintain_request')
  @PermissionCode(REJECT_MAINTAIN_REQUEST_PERMISSION.code)
  @Put('/maintain-requests/:id/reject')
  @ApiOperation({
    tags: ['MaintainRequest', 'MMS'],
    summary: '',
    description: 'Từ chối yêu cầu bảo trì',
  })
  @ApiResponse({
    status: 200,
    description: 'Reject successfully',
    type: SuccessResponse,
  })
  async rejectMaintainRequest(
    @Param('id') id: string,
    @Body() payload: UpdateMaintainStatusBodyDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.id = id;
    return await this.maintainRequestService.reject(request);
  }

  @PermissionCode(LIST_MAINTAIN_REQUEST_PERMISSION.code)
  @Get('/maintain-requests')
  @ApiOperation({
    tags: ['Maintain Request', 'MMS'],
    summary: '',
    description: 'Danh sách yêu cầu bảo trì',
  })
  @ApiResponse({
    status: 200,
    description: 'List Maintain Request successfully',
    type: null,
  })
  // @MessagePattern('list_maintain_request')
  async listMaintainRequest(
    @Query() payload: ListMaintainRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.maintainRequestService.list(request);
  }

  @PermissionCode(DETAIL_MAINTAIN_REQUEST_PERMISSION.code)
  @Get('/maintain-requests/:id')
  @ApiOperation({
    tags: ['Maintain Request', 'MMS'],
    summary: '',
    description: 'Chi tiết yêu cầu bảo trì',
  })
  @ApiResponse({
    status: 200,
    description: 'Detail Maintain Request successfully',
    type: null,
  })
  // @MessagePattern('detail_maintain_request')
  async detailMaintainRequest(@Param('id') id: string): Promise<any> {
    return await this.maintainRequestService.detail(id);
  }

  // @MessagePattern('get_maintain_request_by_assign_device')
  @Get('/devices/assign-device/:id/maintain-request')
  @ApiOperation({
    tags: ['get maintain request by assign device'],
    summary: 'Get maintain request by assign device',
    description: 'Lấy danh sách lịch sử bảo trì theo mã phân công thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Get successfully',
    type: GetMaintainRequestByAssignDeviceResponse,
  })
  async getMaintainRequestByAssignDevice(
    @Param('id') id: string,
    @Query() payload: GetMaintainRequestByAssignDeviceRequest,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.id = id;
    return await this.maintainRequestService.getMaintainRequestByAssignDevice(
      request,
    );
  }

  // @MessagePattern('completed_maintain_request')
  @PermissionCode(COMPLETED_MAINTAIN_REQUEST_PERMISSION.code)
  @Put('/maintain-requests/:id/complete')
  @ApiOperation({
    tags: ['MaintainRequest', 'MMS'],
    summary: '',
    description: 'Hoàn thành yêu cầu bảo trì',
  })
  @ApiResponse({
    status: 200,
    description: 'Completed successfully',
    type: SuccessResponse,
  })
  async completedMaintainRequest(
    @Param() param: UpdateMaintainRequestStatusDto,
  ): Promise<any> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.maintainRequestService.completeMaintainRequest(request);
  }

  // @MessagePattern('re_do_maintain_request')
  @PermissionCode(REDO_MAINTAIN_REQUEST_PERMISSION.code)
  @Put('/maintain-requests/:id/re-do')
  @ApiOperation({
    tags: ['MaintainRequest', 'MMS'],
    summary: '',
    description: 'Làm lại yêu cầu bảo trì',
  })
  @ApiResponse({
    status: 200,
    description: 'Redo successfully',
    type: SuccessResponse,
  })
  async reDoMaintainRequest(
    @Param('id') id: string,
    @Body() payload: UpdateMaintainStatusBodyDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.id = id;
    return await this.maintainRequestService.reDoingMaintainRequest(request);
  }

  // @MessagePattern('get_maintain_request_histories')
  @Get('/maintain-requests/:id/histories')
  @ApiOperation({
    tags: ['MaintainRequest', 'MMS'],
    summary: '',
    description: 'lịch sử hoạt động bảo trì',
  })
  @ApiResponse({
    status: 200,
    description: 'Reject successfully',
    type: MaintainRequestHistoriesResponseDto,
  })
  async getMaintainRequestHistories(
    @Param() param: GetMaintainRequestHistoriesDto,
  ): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.maintainRequestService.getMaintainRequestHistory(request);
  }
}
