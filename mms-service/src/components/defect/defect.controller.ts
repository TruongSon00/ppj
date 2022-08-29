import {
  Controller,
  Injectable,
  Inject,
  Body,
  Query,
  Param,
  Post,
  Put,
  Get,
  Delete,
} from '@nestjs/common';
import { DefectServiceInterface } from './interface/defect.service.interface';
import { isEmpty } from 'lodash';
import { CreateDefectRequestDto } from '@components/defect/dto/request/create-defect.request.dto';
import { GetListDefectRequestDto } from '@components/defect/dto/request/get-list-defect.request.dto';
import { UpdateDefectRequestBodyDto } from '@components/defect/dto/request/update-defect.request.dto';
import { ExportDefectRequestDto } from '@components/defect/dto/request/export-defect.request.dto';
import { DetailDefectRequestDto } from './dto/request/detail-defect.request.dto';
import { DeleteDefectRequestDto } from './dto/request/delete-defect.request.dto';
import { CreateDefectResponseDto } from './dto/response/create-defect.response.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetListDefectResponseDto } from './dto/response/get-list-defect.response.dto';
import { DetailDefectResponse } from './dto/response/detail-defect.response.dto';
import { UpdateDefectResponseDto } from './dto/response/update-defect.response.dto';
import { SuccessResponse } from '@utils/success.response.dto';
import { CREATE_DEFECT_PERMISSION, DELETE_DEFECT_PERMISSION, DETAIL_DEFECT_PERMISSION, LIST_DEFECT_PERMISSION, UPDATE_DEFECT_PERMISSION } from '@utils/permissions/defect';
import { PermissionCode } from '@core/decorator/get-code.decorator';
@Injectable()
@Controller()
export class DefectController {
  constructor(
    @Inject('DefectServiceInterface')
    private readonly defectService: DefectServiceInterface,
  ) {}
  
  @PermissionCode(CREATE_DEFECT_PERMISSION.code)
  @Post('/defects')
  @ApiOperation({
    tags: ['Defect'],
    summary: 'Create Defect',
    description: 'Create a new Defect',
  })
  @ApiResponse({
    status: 200,
    description: 'Created successfully',
    type: CreateDefectResponseDto,
  })
  //@MessagePattern('create_defect')
  async create(@Body() payload: CreateDefectRequestDto): Promise<any> {
    const { responseError, request } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.defectService.create(request);
  }

  //@MessagePattern('list_defect')
  @PermissionCode(LIST_DEFECT_PERMISSION.code)
  @Get('/defects')
  @ApiOperation({
    tags: ['List Defect'],
    summary: 'List Defect',
    description: 'List Defect',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GetListDefectResponseDto,
  })
  async getList(@Query() payload: GetListDefectRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.defectService.getList(request);
  }

  //@MessagePattern('detail_defect')
  @PermissionCode(DETAIL_DEFECT_PERMISSION.code)
  @Get('/defects/:id')
  @ApiOperation({
    tags: ['Defect'],
    summary: 'Detail Defect',
    description: 'Detail Defect',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DetailDefectResponse,
  })
  async detail(@Param() param: DetailDefectRequestDto): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.defectService.getDetail(request);
  }

  //@MessagePattern('update_defect')
  @PermissionCode(UPDATE_DEFECT_PERMISSION.code)
  @Put('/defects/:id')
  @ApiOperation({
    tags: ['Defect'],
    summary: 'Update Defect',
    description: 'Update an existing Defect',
  })
  @ApiResponse({
    status: 200,
    description: 'Update successfully',
    type: UpdateDefectResponseDto,
  })
  async update(
    @Body() payload: UpdateDefectRequestBodyDto,
    @Param('id') id: string,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request._id = id;
    return await this.defectService.update(request);
  }
  //@MessagePattern('delete_defect')
  @PermissionCode(DELETE_DEFECT_PERMISSION.code)
  @Delete('/defects/:id')
  @ApiOperation({
    tags: ['Defect'],
    summary: 'Delete Defect',
    description: 'Delete an existing Defect',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete successfully',
    type: SuccessResponse,
  })
  async delete(@Param() payload: DeleteDefectRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.defectService.delete(request);
  }

  //@MessagePattern('export_defect')
  @Post('/defects/export')
  @ApiOperation({
    tags: ['Export Defect'],
    summary: 'Export Defect',
    description: 'Export Defect',
  })
  @ApiResponse({
    status: 200,
    description: 'Export successfully',
  })
  public async exportDefect(
    @Body() payload: ExportDefectRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.defectService.exportDefect(request);
  }
}
