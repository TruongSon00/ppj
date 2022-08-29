import { Public } from '@core/decorator/set-public.decorator';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InsertDataRequestDto } from './dto/request/insert-data.request.dto';
import { InitDataServiceInterface } from './interface/init-data.service.interface';

@Controller('')
export class InitDataController {
  constructor(
    @Inject('InitDataServiceInterface')
    private readonly initDataService: InitDataServiceInterface,
  ) {}

  // @MessagePattern('user_service_insert_data')
  @Public()
  @Post('/init-insert-data')
  @ApiOperation({
    tags: ['User'],
    summary: 'init insert data',
    description: 'init insert data',
  })
  @ApiResponse({
    status: 200,
    description: 'Confirm successfully',
    type: null,
  })
  public async createSector(
    @Body() request: InsertDataRequestDto[],
  ): Promise<any> {
    return await this.initDataService.insertData(request);
  }
}
