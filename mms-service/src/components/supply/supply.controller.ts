import {
  Controller,
  Injectable,
  Get,
  Inject,
  Post,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Body } from '@nestjs/common';
import { SupplyServiceInterface } from './interface/supply.service.interface';
import { isEmpty } from 'lodash';
import { CreateSupplyRequestDto } from '@components/supply/dto/request/create-supply.request.dto';
import { GetListSupplyRequestDto } from '@components/supply/dto/request/get-list-supply.request.dto';
import { UpdateSupplyBodyDto } from '@components/supply/dto/request/update-supply.request.dto';
import { ExportSupplyRequestDto } from '@components/supply/dto/request/export-supply.request.dto';
import { DeleteSupplyRequestDto } from './dto/request/delete-supply.request.dto';
import { DetailSupplyRequestDto } from './dto/request/detail-supply.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateSupplyResponseDto } from './dto/response/create-supply.response.dto';
import { GetListSupplyResponseDto } from './dto/response/get-list-supply.response.dto';
import { GetDetailSupplyResponseDto } from './dto/response/get-detail-supply.response.dto';
import { UpdateSupplyResponseDto } from './dto/response/update-supply.response.dto';
import { SuccessResponse } from '@utils/success.response.dto';
import {
  CONFIRM_SUPPLY_PERMISSION,
  CREATE_SUPPLY_PERMISSION,
  DELETE_SUPPLY_PERMISSION,
  DETAIL_SUPPLY_PERMISSION,
  EXPORT_SUPPLY_PERMISSION,
  LIST_SUPPLY_PERMISSION,
  UPDATE_SUPPLY_PERMISSION,
} from '@utils/permissions/supply';
import { PermissionCode } from '@core/decorator/get-code.decorator';
import { confirmSupplyParamDto } from './dto/request/confirm-supply.request.dto';

@Injectable()
@Controller()
export class SupplyController {
  constructor(
    @Inject('SupplyServiceInterface')
    private readonly supplyService: SupplyServiceInterface,
  ) {}

  // @MessagePattern('create_supply')
  @PermissionCode(CREATE_SUPPLY_PERMISSION.code)
  @Post('/supplies')
  @ApiOperation({
    tags: ['Supply'],
    summary: 'Create Supply',
    description: 'Create a new Supply',
  })
  @ApiResponse({
    status: 200,
    description: 'Created successfully',
    type: CreateSupplyResponseDto,
  })
  async create(@Body() payload: CreateSupplyRequestDto): Promise<any> {
    const { responseError, request } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyService.create(request);
  }

  // @MessagePattern('list_supply')
  @PermissionCode(LIST_SUPPLY_PERMISSION.code)
  @Get('/supplies')
  @ApiOperation({
    tags: ['List Supply'],
    summary: 'List Supply',
    description: 'List Supply',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GetListSupplyResponseDto,
  })
  async getList(@Query() payload: GetListSupplyRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyService.getList(request);
  }

  // @MessagePattern('detail_supply')
  @PermissionCode(DETAIL_SUPPLY_PERMISSION.code)
  @Get('/supplies/:id')
  @ApiOperation({
    tags: ['Supply'],
    summary: 'Detail Supply',
    description: 'Detail Supply',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GetDetailSupplyResponseDto,
  })
  async detail(@Param() param: DetailSupplyRequestDto): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyService.detail(request.id);
  }

  // @MessagePattern('update_supply')
  @PermissionCode(UPDATE_SUPPLY_PERMISSION.code)
  @Put('/supplies/:id')
  @ApiOperation({
    tags: ['Supply'],
    summary: 'Update Supply',
    description: 'Update an existing Supply',
  })
  @ApiResponse({
    status: 200,
    description: 'Update successfully',
    type: UpdateSupplyResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateSupplyBodyDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request._id = id;
    return await this.supplyService.update(request);
  }
  // @MessagePattern('delete_supply')
  @PermissionCode(DELETE_SUPPLY_PERMISSION.code)
  @Delete('/supplies/:id')
  @ApiOperation({
    tags: ['Supply'],
    summary: 'Delete Supply',
    description: 'Delete an existing Supply',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete successfully',
    type: SuccessResponse,
  })
  async delete(@Param() param: DeleteSupplyRequestDto): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.supplyService.delete(request);
  }

  // @MessagePattern('confirm_supply')
  @PermissionCode(CONFIRM_SUPPLY_PERMISSION.code)
  @Put('/supplies/:id/confirmed')
  @ApiOperation({
    tags: ['Supply Group'],
    summary: 'Confirm Supply Group',
    description: 'Confirm an existing Supply Group',
  })
  @ApiResponse({
    status: 200,
    description: 'Confirm successfully',
    type: UpdateSupplyResponseDto,
  })
  async confirmSupplyGroup(
    @Param() param: confirmSupplyParamDto,
  ): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request._id = request.id;
    return await this.supplyService.confirm(request);
  }

  // @MessagePattern('export_supply')
  @PermissionCode(EXPORT_SUPPLY_PERMISSION.code)
  @Post('supplies/export')
  @ApiOperation({
    tags: ['Export Supply'],
    summary: 'Export Supply',
    description: 'Export Supply',
  })
  @ApiResponse({
    status: 200,
    description: 'Export successfully',
  })
  public async exportSupply(
    @Body() payload: ExportSupplyRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.supplyService.exportSupply(request);
  }
}
