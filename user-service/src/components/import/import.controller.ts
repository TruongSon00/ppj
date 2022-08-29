import {
  Body,
  Controller,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { isEmpty } from 'lodash';
import { ImportBodyRequestDto } from './dto/request/import.request.dto';
import { ImportServiceInterface } from './interface/import.service.interface';

@Controller('import')
export class ImportController {
  constructor(
    @Inject('ImportServiceInterface')
    private readonly importService: ImportServiceInterface,
  ) {}

  // @MessagePattern('import_xlsx')
  @Post('/import/:type')
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
  public async export(
    @Body() payload: ImportBodyRequestDto,
    @Param('type', new ParseIntPipe()) type,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.importService.import({ ...request, type });
  }
}
