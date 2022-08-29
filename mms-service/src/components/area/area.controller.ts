import {
  Controller,
  Get,
  Inject,
  Injectable,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { isEmpty } from 'lodash';
import { DetailAreaRequest } from './dto/request/detail-area.request';
import { GetListAreaQuery } from './dto/request/get-list-area.query';
import { DetailAreaResponse } from './dto/response/detail-area.response';
import { ListAreaResponse } from './dto/response/list-area.response';
import { AreaServiceInterface } from './interface/area.service.interface';

@Injectable()
@Controller('areas')
export class AreaController {
  constructor(
    @Inject('AreaServiceInterface')
    private readonly areaService: AreaServiceInterface,
  ) {}

  //@MessagePattern('detail_area')
  @Get('/:id')
  @ApiOperation({
    tags: ['Area'],
    summary: 'Detail Area',
    description: 'Detail Area',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DetailAreaResponse,
  })
  async detail(@Param() param: DetailAreaRequest): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.areaService.detail(request);
  }

  //@MessagePattern('list_area')
  @Get('/')
  @ApiOperation({
    tags: ['List Area'],
    summary: 'List Area',
    description: 'List Area',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ListAreaResponse,
  })
  async list(@Query() query: GetListAreaQuery): Promise<any> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.areaService.list(request);
  }
}
