import {
  Body,
  Controller,
  Get,
  Inject,
  Injectable,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessResponse } from '@utils/success.response.dto';
import { isEmpty } from 'lodash';
import { ErrorTypeServiceInterface } from './interface/error-type.service.interface';
import { CreateErrorTypeRequest } from './dto/request/create-error-type.request';
import { DetailErrorTypeRequest } from './dto/request/detail-error-type.request';
import { UpdateErrorTypeBodyDto } from './dto/request/update-error-type.request';
import { DetailErrorTypeResponse } from './dto/response/detail-error-type.response';
import { GetListErrorTypeQuery } from './dto/request/get-list-error-type.query';
import { ListErrorTypeResponse } from './dto/response/list-error-type.response';

@Injectable()
@Controller('error-types')
export class ErrorTypeController {
  constructor(
    @Inject('ErrorTypeServiceInterface')
    private readonly errorTypeService: ErrorTypeServiceInterface,
  ) {}

  @Post('/')
  @ApiOperation({
    tags: ['Create error type'],
    summary: 'Định nghĩa loại lỗi',
    description: 'Định nghĩa loại lỗi',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async create(@Body() payload: CreateErrorTypeRequest): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.errorTypeService.create(request);
  }

  //@MessagePattern('update_error_type')
  @Put('/:id')
  @ApiOperation({
    tags: ['Error type'],
    summary: 'Update error type',
    description: 'Update an existing error type',
  })
  @ApiResponse({
    status: 200,
    description: 'Update successfully',
    type: SuccessResponse,
  })
  async update(
    @Param() param: DetailErrorTypeRequest,
    @Body() payload: UpdateErrorTypeBodyDto,
  ): Promise<any> {
    const { request: requestParam, responseError: responseParamError } = param;
    if (responseParamError && !isEmpty(responseParamError)) {
      return responseParamError;
    }
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.errorTypeService.update({
      id: requestParam.id,
      ...request,
    });
  }

  //@MessagePattern('detail_error_type')
  @Get('/:id')
  @ApiOperation({
    tags: ['Error type'],
    summary: 'Detail error type',
    description: 'Detail error type',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DetailErrorTypeResponse,
  })
  async detail(@Param() param: DetailErrorTypeRequest): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.errorTypeService.detail(request);
  }

  //@MessagePattern('list_error_type')
  @Get('/')
  @ApiOperation({
    tags: ['List error type'],
    summary: 'List error type',
    description: 'List error type',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ListErrorTypeResponse,
  })
  async list(@Query() query: GetListErrorTypeQuery): Promise<any> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.errorTypeService.list(request);
  }
}
