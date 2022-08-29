import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { isEmpty } from 'lodash';
import { ImportExcelRequest } from './dto/import-excel.request';
import { ImportExcelServiceInterface } from './interface/import-excel.service.interface';

@Controller('import')
export class ImportExcelController {
  constructor(
    @Inject('ImportExcelServiceInterface')
    private readonly importExcelService: ImportExcelServiceInterface,
  ) {}

  @Post('/')
  @ApiOperation({
    tags: ['Import'],
    summary: 'Import',
    description: 'Import excel',
  })
  @ApiResponse({
    status: 200,
    description: 'Post import successfully',
  })
  @ApiConsumes('multipart/form-data')
  public async export(@Body() payload: ImportExcelRequest): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.importExcelService.import(request);
  }
}
