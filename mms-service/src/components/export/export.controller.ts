import { Controller, Get, Inject, Query } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { ExportRequestDto } from './dto/request/export.request.dto';
import { ExportServiceInterface } from './interface/export.service.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('export')
export class ExportController {
  constructor(
    @Inject('ExportServiceInterface')
    private readonly exportService: ExportServiceInterface,
  ) {}

  @Get('/')
  @ApiOperation({
    tags: ['Export sale'],
    summary: 'Export',
    description: 'Xuất danh sách ',
  })
  @ApiResponse({
    status: 200,
    description: 'Get export successfully',
  })
  // @MessagePattern('export_xlsx')
  public async export(@Query() payload: ExportRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.exportService.export(request);
  }
}
