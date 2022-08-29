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
import { GetListInterRegionQuery } from './dto/request/get-list-inter-region.query';
import { DetailInterRegionRequest } from './dto/request/detail-inter-region.request';
import { DetailInterRegionResponse } from './dto/response/detail-inter-region.response';
import { ListInterRegionResponse } from './dto/response/list-inter-region.response';
import { InterRegionServiceInterface } from './interface/inter-region.service.interface';

@Injectable()
@Controller('inter-regions')
export class InterRegionController {
  constructor(
    @Inject('InterRegionServiceInterface')
    private readonly interRegionService: InterRegionServiceInterface,
  ) {}

  //@MessagePattern('detail_inter_region')
  @Get('/:id')
  @ApiOperation({
    tags: ['Inter Region'],
    summary: 'Detail Inter Region',
    description: 'Detail Inter Region',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DetailInterRegionResponse,
  })
  async detail(@Param() param: DetailInterRegionRequest): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.interRegionService.detail(request);
  }

  //@MessagePattern('list_inter_region')
  @Get('/')
  @ApiOperation({
    tags: ['List Inter Region'],
    summary: 'List Inter Region',
    description: 'List Inter Region',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ListInterRegionResponse,
  })
  async list(@Query() query: GetListInterRegionQuery): Promise<any> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.interRegionService.list(request);
  }
}
