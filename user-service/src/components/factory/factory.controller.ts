import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty } from 'lodash';
import { FactoryServiceInterface } from './interface/factory.service.interface';
import { CreateFactoryRequestDto } from './dto/request/create-factory.request.dto';
import { FactoryDataResponseDto } from './dto/response/factory-data.response.dto';
import { UpdateFactoryBodyRequestDto } from './dto/request/update-factory.request.dto';
import { GetListFactoryRequestDto } from './dto/request/get-list-factory.request.dto';
import { GetListFactoryResponseDto } from './dto/response/get-list-factory.response.dto';
import { SetStatusRequestDto } from './dto/request/set-status.request.dto';
import { FileUpdloadRequestDto } from '@core/dto/file-upload.request';
import { PermissionCode } from '@core/decorator/get-code.decorator';
import {
  UPDATE_FACTORY_PERMISSION,
  CREATE_FACTORY_PERMISSION,
  CONFIRM_FACTORY_PERMISSION,
  REJECT_FACTORY_PERMISSION,
  DELETE_FACTORY_PERMISSION,
  DETAIL_FACTORY_PERMISSION,
  LIST_FACTORY_PERMISSION,
  IMPORT_FACTORY_PERMISSION,
} from '@utils/permissions/factory';
import { DetailRequestDto } from '@utils/common.request.dto';
import { DeleteMultipleDto } from '@core/dto/multiple/delete-multiple.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessResponse } from '@utils/success.response.dto';
import { ImportResponseDto } from '@core/dto/import/response/import.response.dto';

@Controller('factories')
export class FactoryController {
  constructor(
    @Inject('FactoryServiceInterface')
    private readonly factoryService: FactoryServiceInterface,
  ) {}

  @MessagePattern('get_factories_by_name_keyword')
  public async getItemByConditions(@Body() payload: any): Promise<any> {
    return await this.factoryService.getFactoriesByNameKeyword(
      payload.nameKeyword,
    );
  }

  @PermissionCode(CREATE_FACTORY_PERMISSION.code)
  // @MessagePattern('create_factory')
  @Post('/create')
  @ApiOperation({
    tags: ['Factory'],
    summary: 'Create Factory Type',
    description: 'Tạo mới nhà máy',
  })
  @ApiResponse({
    status: 200,
    description: 'Create successfully',
    type: FactoryDataResponseDto,
  })
  public async create(
    @Body() payload: CreateFactoryRequestDto,
  ): Promise<ResponsePayload<FactoryDataResponseDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.factoryService.create(request);
  }

  @PermissionCode(IMPORT_FACTORY_PERMISSION.code)
  // @MessagePattern('import_factory')
  @Post('/import')
  @ApiOperation({
    tags: ['Factory'],
    summary: 'Import Factory Type',
    description: 'Nhập một loạt nhà máy mới',
  })
  @ApiResponse({
    status: 200,
    description: 'Import successfully',
    type: ImportResponseDto,
  })
  public async importFactory(
    @Body() body: FileUpdloadRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.factoryService.importFactory(request);
  }

  @PermissionCode(UPDATE_FACTORY_PERMISSION.code)
  // @MessagePattern('update_factory')
  @Put('/:id')
  @ApiOperation({
    tags: ['Factory'],
    summary: 'Update Factory Type',
    description: 'Sửa thông tin nhà máy',
  })
  @ApiResponse({
    status: 200,
    description: 'Update successfully',
    type: FactoryDataResponseDto,
  })
  public async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() payload: UpdateFactoryBodyRequestDto,
  ): Promise<ResponsePayload<FactoryDataResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.factoryService.update({ ...request, id });
  }

  @PermissionCode(DELETE_FACTORY_PERMISSION.code)
  // @MessagePattern('delete_factory')
  @Delete('/:id')
  @ApiOperation({
    tags: ['Factory'],
    summary: 'Delete Factory Type',
    description: 'Xóa nhà máy',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete successfully',
    type: SuccessResponse,
  })
  public async delete(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ResponsePayload<any>> {
    return await this.factoryService.delete(id);
  }

  @PermissionCode(DELETE_FACTORY_PERMISSION.code)
  // @MessagePattern('delete_factory_multiple')
  @Delete('/multiple')
  @ApiOperation({
    tags: ['Factory'],
    summary: 'Delete multiple Factory Type',
    description: 'Xóa nhiều nhà máy',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete successfully',
    type: SuccessResponse,
  })
  public async deleteMultiple(
    @Query() query: DeleteMultipleDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.factoryService.deleteMultiple(request);
  }

  @PermissionCode(DETAIL_FACTORY_PERMISSION.code)
  // @MessagePattern('detail_factory')
  @Get('/:id')
  @ApiOperation({
    tags: ['Factory'],
    summary: 'Detail Factory Type',
    description: 'Chi tiết nhà máy',
  })
  @ApiResponse({
    status: 200,
    description: 'Get Factory Detail successfully',
    type: FactoryDataResponseDto,
  })
  public async getDetail(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ResponsePayload<FactoryDataResponseDto | any>> {
    return await this.factoryService.getDetail(id);
  }

  @PermissionCode(LIST_FACTORY_PERMISSION.code)
  // @MessagePattern('list_factories')
  @Get('/list')
  @ApiOperation({
    tags: ['Factory'],
    summary: 'List Factory Type',
    description: 'Danh sách nhà máy',
  })
  @ApiResponse({
    status: 200,
    description: 'Get Factory List successfully',
    type: GetListFactoryResponseDto,
  })
  public async getList(
    @Query() payload: GetListFactoryRequestDto,
  ): Promise<ResponsePayload<GetListFactoryResponseDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.factoryService.getList(request);
  }

  @PermissionCode(CONFIRM_FACTORY_PERMISSION.code)
  // @MessagePattern('confirm_factory')
  @Put('/:id/confirm')
  @ApiOperation({
    tags: ['Factory'],
    summary: 'Confirm Factory',
    description: 'Xác nhận nhà máy',
  })
  @ApiResponse({
    status: 200,
    description: 'Confirm successfully',
    type: FactoryDataResponseDto,
  })
  public async confirm(
    @Req() payload: SetStatusRequestDto,
  ): Promise<ResponsePayload<FactoryDataResponseDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.factoryService.confirm(request);
  }

  @PermissionCode(REJECT_FACTORY_PERMISSION.code)
  // @MessagePattern('reject_factory')
  @Put('/:id/reject')
  @ApiOperation({
    tags: ['Factory'],
    summary: 'Reject Factory',
    description: 'Từ chối xác nhận nhà máy',
  })
  @ApiResponse({
    status: 200,
    description: 'Reject successfully',
    type: FactoryDataResponseDto,
  })
  public async reject(
    @Req() payload: SetStatusRequestDto,
  ): Promise<ResponsePayload<FactoryDataResponseDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.factoryService.reject(request);
  }

  @MessagePattern('is_exist_factory')
  public async isExist(
    @Body() payload: SetStatusRequestDto,
  ): Promise<ResponsePayload<FactoryDataResponseDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.factoryService.isExist(request);
  }

  @PermissionCode(DETAIL_FACTORY_PERMISSION.code)
  @MessagePattern('detail_factory')
  public async getDetailTcp(
    @Body() payload: DetailRequestDto,
  ): Promise<ResponsePayload<FactoryDataResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.factoryService.getDetail(request.id);
  }

  @PermissionCode(LIST_FACTORY_PERMISSION.code)
  @MessagePattern('list_factories')
  public async getListTcp(
    @Body() payload: GetListFactoryRequestDto,
  ): Promise<ResponsePayload<GetListFactoryResponseDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.factoryService.getList(request);
  }
}
