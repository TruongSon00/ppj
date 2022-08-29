import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SupplyGroupServiceInterface } from '@components/supply-group/interface/supply-group.service.interface';
import { CreateSupplyGroupRequestDto } from '@components/supply-group/dto/request/create-supply-group.request.dto';
import { isEmpty } from 'lodash';
import { GetListSupplyGroupRequestDto } from '@components/supply-group/dto/request/get-list-supply-group.request.dto';
import { DetailSupplyGroupRequestDto } from './dto/request/detail-supply-group.request.dto';
import { UpdateSupplyGroupRequestBodyDto } from './dto/request/update-supply-group.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessResponse } from '@utils/success.response.dto';
import {
  CREATE_SUPPLY_GROUP_PERMISSION,
  DETAIL_SUPPLY_GROUP_PERMISSION,
  LIST_SUPPLY_GROUP_PERMISSION,
  UPDATE_SUPPLY_GROUP_PERMISSION,
} from '@utils/permissions/supply-group';
import { PermissionCode } from '@core/decorator/get-code.decorator';
import { ActiveUnitPayload } from '@components/unit/dto/request/active-unit.request';
import { ACTIVE_ENUM } from '@constant/common';
import { GetDetailSupplyGroupResponseDto } from './dto/response/get-detail-supply-group.response.dto';

@Controller('supply-groups')
export class SupplyGroupController {
  constructor(
    @Inject('SupplyGroupServiceInterface')
    private readonly supplyGroupService: SupplyGroupServiceInterface,
  ) {}

  @PermissionCode(CREATE_SUPPLY_GROUP_PERMISSION.code)
  @Post('')
  @ApiOperation({
    tags: ['Supply Group'],
    summary: 'Create Supply Group',
    description: 'Create a new Supply Group',
  })
  @ApiResponse({
    status: 200,
    description: 'Created successfully',
    type: SuccessResponse,
  })
  async create(@Body() payload: CreateSupplyGroupRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyGroupService.create(request);
  }

  @PermissionCode(DETAIL_SUPPLY_GROUP_PERMISSION.code)
  @Get('/:id')
  @ApiOperation({
    tags: ['Supply Group'],
    summary: 'Detail Supply Group',
    description: 'Detail Supply Group',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GetDetailSupplyGroupResponseDto,
  })
  async detail(@Param() param: DetailSupplyGroupRequestDto): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyGroupService.detail(request);
  }

  @PermissionCode(UPDATE_SUPPLY_GROUP_PERMISSION.code)
  @Put('/:id')
  @ApiOperation({
    tags: ['Supply Group'],
    summary: 'Update Supply Group',
    description: 'Update an existing Supply Group',
  })
  @ApiResponse({
    status: 200,
    description: 'Update successfully',
    type: SuccessResponse,
  })
  async update(
    @Param() param: DetailSupplyGroupRequestDto,
    @Body() payload: UpdateSupplyGroupRequestBodyDto,
  ): Promise<any> {
    const { request: paramRequest, responseError: paramError } = param;
    if (paramError && !isEmpty(paramError)) {
      return paramError;
    }
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.supplyGroupService.update({
      ...request,
      id: paramRequest.id,
    });
  }

  @PermissionCode(LIST_SUPPLY_GROUP_PERMISSION.code)
  @Get('/list')
  @ApiOperation({
    tags: ['Supply Group'],
    summary: 'List Of Supply Group',
    description: 'List Of Supply Group',
  })
  @ApiResponse({
    status: 200,
    description: 'Get List successfully',
    type: null,
  })
  async getList(@Query() payload: GetListSupplyGroupRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyGroupService.getList(request);
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
    return await this.supplyGroupService.updateStatus({
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
    return await this.supplyGroupService.updateStatus({
      ...request,
      status: ACTIVE_ENUM.INACTIVE,
    });
  }
}
