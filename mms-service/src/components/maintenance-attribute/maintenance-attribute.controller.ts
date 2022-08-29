import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Injectable,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MaintenanceAttributeServiceInterface } from '@components/maintenance-attribute/interface/maintenance-attribute.service.interface';
import { MessagePattern } from '@nestjs/microservices';
import { isEmpty } from 'lodash';
import { CreateMaintenanceAttributeRequestDto } from '@components/maintenance-attribute/dto/request/create-maintenance-attribute.request.dto';
import { GetListMaintenanceAttributeRequestDto } from '@components/maintenance-attribute/dto/request/get-list-maintenance-attribute.request.dto';
import {
  UpdateMaintenanceAttributeBody,
  UpdateMaintenanceAttributeRequestDto,
} from '@components/maintenance-attribute/dto/request/update-maintenance-attribute.request.dto';
import { DetailMaintenanceAttributeRequestDto } from './dto/request/detail-maintenance-attribute.request.dto';
import { DeleteMaintenanceAttributeRequestDto } from './dto/request/delete-maintenance-attribute.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateMaintenanceAttributeResponseDto } from './dto/response/create-maintenance-attribute.response.dto';
import { GetDetailMaintenanceAttributeResponseDto } from './dto/response/get-detail-maintenance-attribute.response.dto';
import { UpdateMaintenanceAttributeResponseDto } from './dto/response/update-maintenance-attribute.response.dto';
import { SuccessResponse } from '@utils/success.response.dto';
import { CREATE_MAINTENANCE_ATTRIBUTE_PERMISSION } from '@utils/permissions/maintenance-attribute';
import { PermissionCode } from '@core/decorator/get-code.decorator';
import { DELETE_MAINTENANCE_TEAM_PERMISSION, DETAIL_MAINTENANCE_TEAM_PERMISSION, LIST_MAINTENANCE_TEAM_PERMISSION, UPDATE_MAINTENANCE_TEAM_PERMISSION } from '@utils/permissions/maintenance-team';

@Injectable()
@Controller()
export class MaintenanceAttributeController {
  constructor(
    @Inject('MaintenanceAttributeServiceInterface')
    private readonly maintenanceAttributeService: MaintenanceAttributeServiceInterface,
  ) {}

  // @MessagePattern('create_maintenance_attribute')
  @PermissionCode(CREATE_MAINTENANCE_ATTRIBUTE_PERMISSION.code)
  @Post('/maintenance-attributes')
  @ApiOperation({
    tags: ['Maintenance Attribute'],
    summary: 'Create Maintenance Attribute',
    description: 'Create a new Maintenance Attribute',
  })
  @ApiResponse({
    status: 200,
    description: 'Created successfully',
    type: CreateMaintenanceAttributeResponseDto,
  })
  async create(
    @Body() payload: CreateMaintenanceAttributeRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.maintenanceAttributeService.create(request);
  }

  // @MessagePattern('list_maintenance_attribute')
  @PermissionCode(LIST_MAINTENANCE_TEAM_PERMISSION.code)
  @Get('/maintenance-attributes/list')
  @ApiOperation({
    tags: ['Maintenance Attribute'],
    summary: 'List Of Maintenance Attribute',
    description: 'List Of Maintenance Attribute',
  })
  @ApiResponse({
    status: 200,
    description: 'Get List successfully',
    type: GetListMaintenanceAttributeRequestDto,
  })
  async getList(
    @Query() payload: GetListMaintenanceAttributeRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.maintenanceAttributeService.getList(request);
  }

  // @MessagePattern('detail_maintenance_attribute')
  @PermissionCode(DETAIL_MAINTENANCE_TEAM_PERMISSION.code)
  @Get('/maintenance-attributes/:id')
  @ApiOperation({
    tags: ['Maintenance Attribute'],
    summary: 'Detail Maintenance Attribute',
    description: 'Detail Maintenance Attribute',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GetDetailMaintenanceAttributeResponseDto,
  })
  async detail(
    @Param() param: DetailMaintenanceAttributeRequestDto,
  ): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.maintenanceAttributeService.detail(request);
  }

  // @MessagePattern('delete_maintenance_attribute')
  @PermissionCode(DELETE_MAINTENANCE_TEAM_PERMISSION.code)
  @Delete('/maintenance-attributes/:id')
  @ApiOperation({
    tags: ['Maintenance Attribute'],
    summary: 'Delete Maintenance Attribute',
    description: 'Delete an existing Maintenance Attribute',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete successfully',
    type: SuccessResponse,
  })
  async delete(
    @Param() param: DeleteMaintenanceAttributeRequestDto,
  ): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.maintenanceAttributeService.delete(request);
  }

  // @MessagePattern('update_maintenance_attribute')
  @PermissionCode(UPDATE_MAINTENANCE_TEAM_PERMISSION.code)
  @Put('/maintenance-attributes/:id')
  @ApiOperation({
    tags: ['Maintenance Attribute'],
    summary: 'Update Maintenance Attribute',
    description: 'Update an existing Maintenance Attribute',
  })
  @ApiResponse({
    status: 200,
    description: 'Update successfully',
    type: UpdateMaintenanceAttributeResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateMaintenanceAttributeBody,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request._id = id;
    return await this.maintenanceAttributeService.update(request);
  }
}
