import {
  Body,
  Controller,
  Get,
  Inject,
  Injectable,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { isEmpty } from 'lodash';
import { DetailRegionRequest } from './dto/request/detail-region.request';
import { GetListRegionQuery } from './dto/request/get-list-region.query';
import { DetailRegionResponse } from './dto/response/detail-region.response';
import { ListRegionResponse } from './dto/response/list-region.response';
import { RegionServiceInterface } from './interface/region.service.interface';

@Injectable()
@Controller('regions')
export class RegionController {
  constructor(
    @Inject('RegionServiceInterface')
    private readonly regionService: RegionServiceInterface,
  ) {}

  //@MessagePattern('detail_region')
  @Get('/:id')
  @ApiOperation({
    tags: ['Region'],
    summary: 'Detail Region',
    description: 'Detail Region',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DetailRegionResponse,
  })
  async detail(@Param() param: DetailRegionRequest): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.regionService.detail(request);
  }

  //@MessagePattern('list_region')
  @Get('/')
  @ApiOperation({
    tags: ['List Region'],
    summary: 'List Region',
    description: 'List Region',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ListRegionResponse,
  })
  async list(@Query() query: GetListRegionQuery): Promise<any> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.regionService.list(request);
  }
}
