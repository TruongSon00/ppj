import {
  Body,
  Controller,
  Inject,
  Injectable,
  Query,
  Param,
  Post,
  Get,
} from '@nestjs/common';
import { isEmpty } from 'lodash';

import { DeviceStatusServiceInterface } from './interface/device-status.service.interface';
import { CreateDeviceStatusActivityRequestDto } from './dto/request/create-device-status-activity.request.dto';
import { ListDeviceStatusQuery } from './dto/query/list-device-status.query';
import { ListDeviceStatusActivityInfoQuery } from './dto/request/list-device-status-activity-info.request.dto';
import { ListDeviceStatusBySerialQuery } from './dto/request/list-device-status-by-serial.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessResponse } from '@utils/success.response.dto';
import { ListDeviceStatusResponse } from './dto/response/list-device-status.response';
import { LIST_DEVICE_STATUS_ACTIVITY_INFO_PERMISSION, LIST_DEVICE_STATUS_BY_SERIAL_PERMISSION } from '@utils/permissions/report-device-status';
import { PermissionCode } from '@core/decorator/get-code.decorator';
@Injectable()
@Controller()
export class DeviceStatusController {
  constructor(
    @Inject('DeviceStatusServiceInterface')
    private readonly deviceStatusService: DeviceStatusServiceInterface,
  ) {}

  //@MessagePattern('create_device_status_activity_info')
  @Post('/device-status/info-active-create')
  @ApiOperation({
    tags: ['DeviceStatus'],
    summary: 'Thêm mới thông tin hoạt động',
    description: 'Thêm mới thông tin hoạt động',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async createDeviceStatusActivity(
    @Body() payload: CreateDeviceStatusActivityRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceStatusService.createDeviceStatusActivity(
      request,
      request.userId,
    );
  }

  //@MessagePattern('list_device_status_activity_info')
  @PermissionCode(LIST_DEVICE_STATUS_ACTIVITY_INFO_PERMISSION.code)
  @Get('/device-status/:id/list-info-active')
  @ApiOperation({
    tags: ['DeviceStatus'],
    summary: 'Thông tin hoạt động của trạng thái thiết bị',
    description: 'Thông tin hoạt động của trạng thái thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: null,
  })
  async listDeviceStatusActivityInfo(
    @Query() payload: ListDeviceStatusActivityInfoQuery,
    @Param('id') deviceAssignmentId: string,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.deviceAssignmentId = deviceAssignmentId;
    return await this.deviceStatusService.listDeviceStatusActivityInfo(request);
  }

  // @MessagePattern('list_device_status')
  @Get('/device-status')
  @ApiOperation({
    tags: ['List device status'],
    summary: 'Danh sách trạng thái thiết bị',
    description: 'Danh sách trạng thái thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ListDeviceStatusResponse,
  })
  async list(@Query() payload: ListDeviceStatusQuery): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceStatusService.list(request);
  }

  //@MessagePattern('list_device_status_by_serial')
  @PermissionCode(LIST_DEVICE_STATUS_BY_SERIAL_PERMISSION.code)
  @Get('/device-status/:serial')
  @ApiOperation({
    tags: ['DeviceStatus'],
    summary: 'Thông tin hoạt động theo serial thiết bị',
    description: 'Thông tin hoạt động theo serial thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    //type: DeviceStatusBySerialResponseDto,
  })
  async listDeviceStatusBySerial(
    @Query() payload: ListDeviceStatusBySerialQuery,
    @Param('serial') serial: string,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.serial = serial;
    return await this.deviceStatusService.listDeviceStatusBySerial(request);
  }
}
