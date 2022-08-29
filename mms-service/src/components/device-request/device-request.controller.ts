import {
  Body,
  Controller,
  Inject,
  Injectable,
  Param,
  Query,
  Post,
  Put,
  Delete,
  Get,
} from '@nestjs/common';
import { isEmpty } from 'lodash';
import { DeviceRequestServiceInterface } from '@components/device-request/interface/device-request.service.interface';
import { CreateDeviceRequestTicketBody } from '@components/device-request/dto/request/request-ticket/create-device-request-ticket.request.dto';
import { DetailDeviceRequestRequestDto } from '@components/device-request/dto/request/request-ticket/detail-device-request.request.dto';
import { UpdateDeviceRequestTicketBody } from '@components/device-request/dto/request/request-ticket/update-device-request-ticket.request.dto';
import { ListDeviceRequestsRequestDto } from '@components/device-request/dto/request/list-device-requests.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessResponse } from '@utils/success.response.dto';
import { DetailDeviceRequestTicketResponseDto } from './dto/response/detail-device-request-ticket.response.dto';
import { ListDeviceRequestsResponseDto } from './dto/response/list-device-requests.response.dto';
import {
  CREATE_REQUEST_TICKET_PERMISSION,
  DELETE_REQUEST_TICKET_PERMISSION,
  DETAIL_REQUEST_TICKET_PERMISSION,
  LIST_DEVICE_REQUEST_PERMISSION,
  UPDATE_REQUEST_TICKET_PERMISSION,
} from '@utils/permissions/device-request';
import { PermissionCode } from '@core/decorator/get-code.decorator';
import { UpdateStatusDeviceRequestRequestDto } from './dto/request/request-ticket/update-status-device-request.request.dto';
@Injectable()
@Controller('device-requests')
export class DeviceRequestController {
  constructor(
    @Inject('DeviceRequestServiceInterface')
    private readonly deviceRequestService: DeviceRequestServiceInterface,
  ) {}

  @PermissionCode(LIST_DEVICE_REQUEST_PERMISSION.code)
  @ApiOperation({
    tags: ['DeviceRequests'],
    summary: 'Danh sách yêu cầu thiết bị',
    description: 'Danh sách yêu cầu thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ListDeviceRequestsResponseDto,
  })
  @Get('/')
  async list(@Query() query: ListDeviceRequestsRequestDto): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceRequestService.list(request);
  }

  @PermissionCode(CREATE_REQUEST_TICKET_PERMISSION.code)
  @ApiOperation({
    tags: ['DeviceRequests_RequestTickets'],
    summary: 'Tạo yêu cầu cấp thiết bị',
    description: 'Tạo yêu cầu cấp thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: String,
  })
  @Post('/')
  async create(@Body() payload: CreateDeviceRequestTicketBody): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.createdBy = request.userId;

    return await this.deviceRequestService.create(request);
  }

  @PermissionCode(DELETE_REQUEST_TICKET_PERMISSION.code)
  @ApiOperation({
    tags: ['DeviceRequests_RequestTickets'],
    summary: 'Xóa yêu cầu cấp thiết bị',
    description: 'Xóa yêu cầu cấp thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  @Delete('/:id')
  async delete(@Param() payload: DetailDeviceRequestRequestDto): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceRequestService.delete(request.id);
  }

  //@MessagePattern('device_request_ticket_detail')
  @PermissionCode(DETAIL_REQUEST_TICKET_PERMISSION.code)
  @ApiOperation({
    tags: ['DeviceRequests_RequestTickets'],
    summary: 'Chi tiết yêu cầu cấp thiết bị',
    description: 'Chi tiết yêu cầu cấp thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DetailDeviceRequestTicketResponseDto,
  })
  @Get('/:id')
  async detail(@Param() payload: DetailDeviceRequestRequestDto): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceRequestService.detail(request);
  }

  //@MessagePattern('device_request_ticket_update')
  @PermissionCode(UPDATE_REQUEST_TICKET_PERMISSION.code)
  @ApiOperation({
    tags: ['DeviceRequests_RequestTickets'],
    summary: 'Sửa yêu cầu cấp thiết bị',
    description: 'Sửa yêu cầu cấp thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: String,
  })
  @Put('/:id')
  async update(
    @Param() param: DetailDeviceRequestRequestDto,
    @Body() payload: UpdateDeviceRequestTicketBody,
  ): Promise<any> {
    const { request: requestParam, responseError: responseErrorParam } = param;
    if (responseErrorParam && !isEmpty(responseErrorParam)) {
      return responseErrorParam;
    }

    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceRequestService.update({
      ...request,
      id: requestParam.id,
    });
  }

  @PermissionCode(UPDATE_REQUEST_TICKET_PERMISSION.code)
  @ApiOperation({
    tags: ['DeviceRequests_RequestTickets'],
    summary: 'Sửa yêu cầu cấp thiết bị',
    description: 'Sửa yêu cầu cấp thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: String,
  })
  @Put('/:id/:action')
  async updateStatus(
    @Param() param: UpdateStatusDeviceRequestRequestDto,
  ): Promise<any> {
    const { request, responseError } = param;
    if (request && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceRequestService.updateStatus(request);
  }
}
