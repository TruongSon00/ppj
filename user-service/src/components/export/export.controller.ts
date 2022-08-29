import { Controller, Get, Inject, Query, Res } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { ExportRequestDto } from './dto/request/export.request.dto';
import { ExportServiceInterface } from './interface/export.service.interface';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('')
export class ExportController {
  constructor(
    @Inject('ExportServiceInterface')
    private readonly exportService: ExportServiceInterface,
  ) {}

  // @MessagePattern('export_xlsx')
  @Get('/export')
  @ApiOperation({
    tags: ['Export item'],
    summary: 'Export',
    description: 'Xuất danh sách ',
  })
  @ApiResponse({
    status: 200,
    description: 'Get export successfully',
  })
  public async export(
    @Query() payload: ExportRequestDto,
    @Res() res: Response,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.exportService.export(request, res);
  }
}
