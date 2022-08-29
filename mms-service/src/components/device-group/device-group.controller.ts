import {
  Body,
  Controller,
  Inject,
  Param,
  Query,
  Post,
  Put,
  Get,
} from '@nestjs/common';
import { DeviceGroupServiceInterface } from '@components/device-group/interface/device-group.service.interface';
import { CreateDeviceGroupRequestDto } from '@components/device-group/dto/request/create-device-group.request.dto';
import { isEmpty } from 'lodash';
import { UpdateDeviceGroupRequestBody } from '@components/device-group/dto/request/update-device-group.request.dto';
import { GetListDeviceGroupRequestDto } from '@components/device-group/dto/request/get-list-device-group.request.dto';
import { DetailDeviceGroupRequestDto } from './dto/request/detail-device-group.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetDetailDeviceGroupResponseDto } from './dto/response/get-detail-device-group.response.dto';
import { UpdateDeviceGroupResponseDto } from './dto/response/update-device-group.response.dto';
import { SuccessResponse } from '@utils/success.response.dto';
import {
  CREATE_DEVICE_GROUP_PERMISSION,
  DETAIL_DEVICE_GROUP_PERMISSION,
  LIST_DEVICE_GROUP_PERMISSION,
  UPDATE_DEVICE_GROUP_PERMISSION,
} from '@utils/permissions/device-group';
import { PermissionCode } from '@core/decorator/get-code.decorator';
import { ActiveUnitPayload } from '@components/unit/dto/request/active-unit.request';
import { ACTIVE_ENUM } from '@constant/common';
@Controller('device-groups')
export class DeviceGroupController {
  constructor(
    @Inject('DeviceGroupServiceInterface')
    private readonly deviceGroupService: DeviceGroupServiceInterface,
  ) {}
  //@MessagePattern('create_device_group')
  @PermissionCode(CREATE_DEVICE_GROUP_PERMISSION.code)
  @Post('')
  @ApiOperation({
    tags: ['Device group'],
    summary: 'Create Device group',
    description: 'Create a new Device group',
  })
  @ApiResponse({
    status: 200,
    description: 'Created successfully',
  })
  async create(@Body() payload: CreateDeviceGroupRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceGroupService.create(request);
  }
  //@MessagePattern('detail_device_group')
  @PermissionCode(DETAIL_DEVICE_GROUP_PERMISSION.code)
  @Get('/:id')
  @ApiOperation({
    tags: ['Device Group'],
    summary: 'Detail Device Group',
    description: 'Detail Device Group',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GetDetailDeviceGroupResponseDto,
  })
  async detail(@Param() payload: DetailDeviceGroupRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceGroupService.detail(request);
  }

  //@MessagePattern('update_device_group')
  @PermissionCode(UPDATE_DEVICE_GROUP_PERMISSION.code)
  @Put('/:id')
  @ApiOperation({
    tags: ['Device Group'],
    summary: 'Update Device Group',
    description: 'Update an existing Device Group',
  })
  @ApiResponse({
    status: 200,
    description: 'Update successfully',
    type: UpdateDeviceGroupResponseDto,
  })
  async update(
    @Body() payload: UpdateDeviceGroupRequestBody,
    @Param('id') id: string,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request._id = id;
    return await this.deviceGroupService.update(request);
  }

  //@MessagePattern('list_device_group')
  @PermissionCode(LIST_DEVICE_GROUP_PERMISSION.code)
  @Get('/list')
  @ApiOperation({
    tags: ['Device Group List'],
    summary: 'List Of Device Group',
    description: 'List Of Device Group',
  })
  @ApiResponse({
    status: 200,
    description: 'Get List successfully',
    type: null,
  })
  async getList(@Query() payload: GetListDeviceGroupRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceGroupService.getList(request);
  }

  @Put('/:id/active')
  @ApiOperation({
    tags: ['Supply Group'],
    summary: 'Active Supply Group',
    description: 'Active an existing Supply Group',
  })
  @ApiResponse({
    status: 200,
    description: 'Active successfully',
    type: SuccessResponse,
  })
  async active(@Param() payload: ActiveUnitPayload): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceGroupService.updateStatus({
      ...request,
      status: ACTIVE_ENUM.ACTIVE,
    });
  }

  @Put('/:id/inactive')
  @ApiOperation({
    tags: ['Supply Group'],
    summary: 'InActive Supply Group',
    description: 'InActive an existing Supply Group',
  })
  @ApiResponse({
    status: 200,
    description: 'InActive successfully',
    type: SuccessResponse,
  })
  async inactive(@Param() payload: ActiveUnitPayload): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceGroupService.updateStatus({
      ...request,
      status: ACTIVE_ENUM.INACTIVE,
    });
  }
}
