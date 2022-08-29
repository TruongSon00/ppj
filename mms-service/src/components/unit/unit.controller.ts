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
import { GetListUnitQuery } from './dto/request/get-list-unit.query';
import { CreateUnitRequest } from './dto/request/create-unit.request';
import { DetailUnitRequest } from './dto/request/detail-unit.request';
import { UpdateUnitBodyDto } from './dto/request/update-unit.request';
import { DetailUnitResponse } from './dto/response/detail-unit.response';
import { ListUnitResponse } from './dto/response/list-unit.response';
import { UnitServiceInterface } from './interface/unit.service.interface';
import { ActiveUnitPayload } from './dto/request/active-unit.request';
import { ACTIVE_ENUM } from '@constant/common';

@Injectable()
@Controller('units')
export class UnitController {
  constructor(
    @Inject('UnitServiceInterface')
    private readonly unitService: UnitServiceInterface,
  ) {}

  @Post('/')
  @ApiOperation({
    tags: ['Create unit'],
    summary: 'Định nghĩa đơn vị',
    description: 'Định nghĩa đơn vị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async create(@Body() payload: CreateUnitRequest): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.unitService.create(request);
  }

  //@MessagePattern('update_unit')
  @Put('/:id')
  @ApiOperation({
    tags: ['Unit'],
    summary: 'Update Unit',
    description: 'Update an existing unit',
  })
  @ApiResponse({
    status: 200,
    description: 'Update successfully',
    type: SuccessResponse,
  })
  async update(
    @Param() param: DetailUnitRequest,
    @Body() payload: UpdateUnitBodyDto,
  ): Promise<any> {
    const { request: requestParam, responseError: responseParamError } = param;
    if (responseParamError && !isEmpty(responseParamError)) {
      return responseParamError;
    }
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.unitService.update({
      id: requestParam.id,
      ...request,
    });
  }

  //@MessagePattern('detail_unit')
  @Get('/:id')
  @ApiOperation({
    tags: ['Unit'],
    summary: 'Detail unit',
    description: 'Detail unit',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DetailUnitResponse,
  })
  async detail(@Param() param: DetailUnitRequest): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.unitService.detail(request);
  }

  //@MessagePattern('list_unit')
  @Get('/')
  @ApiOperation({
    tags: ['List Unit'],
    summary: 'List Unit',
    description: 'List Unit',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ListUnitResponse,
  })
  async list(@Query() query: GetListUnitQuery): Promise<any> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.unitService.list(request);
  }

  @Put('/:id/active')
  @ApiOperation({
    tags: ['List Unit'],
    summary: 'List Unit',
    description: 'List Unit',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ListUnitResponse,
  })
  async active(@Param() payload: ActiveUnitPayload): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.unitService.updateStatus({
      ...request,
      status: ACTIVE_ENUM.ACTIVE,
    });
  }

  @Put('/:id/inactive')
  @ApiOperation({
    tags: ['List Unit'],
    summary: 'List Unit',
    description: 'List Unit',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ListUnitResponse,
  })
  async inactive(@Param() payload: ActiveUnitPayload): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.unitService.updateStatus({
      ...request,
      status: ACTIVE_ENUM.INACTIVE,
    });
  }
}
