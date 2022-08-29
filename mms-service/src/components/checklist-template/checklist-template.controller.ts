import { GetListCheckListTemplateResponseDto } from '@components/checklist-template/dto/response/get-all-checklist-template.response.dto';
import {
  Body,
  Param,
  Query,
  Controller,
  Inject,
  Injectable,
  Post,
  Put,
  Delete,
  Get,
} from '@nestjs/common';
import { CheckListTemplateServiceInterface } from '@components/checklist-template/interface/checklist-template.service.interface';
import { isEmpty } from 'lodash';
import { CreateCheckListTemplateRequestDto } from '@components/checklist-template/dto/request/create-checklist-template.request.dto';
import { GetListCheckListTemplateRequestDto } from '@components/checklist-template/dto/request/get-list-checklist-template.request.dto';
import {
  UpdateChecklistTemplateParamDto,
  UpdateCheckListTemplateRequestBodyDto,
} from '@components/checklist-template/dto/request/update-checklist-template.request.dto';
import { ExportCheckListTemplateRequestDto } from '@components/checklist-template/dto/request/export-checklist-template.request.dto';
import { DeleteCheclistTemplateRequestDto } from './dto/request/delete-checklist-template.request.dto';
import { DetailCheclistTemplateRequestDto } from './dto/request/detail-checklist-template.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCheckListTemplateResponseDto } from './dto/response/create-checklist-template.response.dto';
import { UpdateCheckListTemplateResponseDto } from './dto/response/update-checklist-template.response.dto';
import { SuccessResponse } from '@utils/success.response.dto';
import { CheckListTemplateDetailResponseDto } from './dto/response/checklist-template-detail.response.dto';

@Injectable()
@Controller()
export class CheckListTemplateController {
  constructor(
    @Inject('CheckListTemplateServiceInterface')
    private readonly checkListTemplateService: CheckListTemplateServiceInterface,
  ) {}

  //@MessagePattern('create_check_list_template')
  @Post('/check-list-templates')
  @ApiOperation({
    tags: ['Check List Template'],
    summary: 'Create Check List Template',
    description: 'Create a new Check List Template',
  })
  @ApiResponse({
    status: 200,
    description: 'Created successfully',
    type: CreateCheckListTemplateResponseDto,
  })
  async create(
    @Body() payload: CreateCheckListTemplateRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.checkListTemplateService.create(request);
  }

  //@MessagePattern('list_check_list_template')
  @Get('/check-list-templates')
  @ApiOperation({
    tags: ['Check List Template'],
    summary: 'Get Checklist Template',
    description: 'Danh sách mẫu phiếu kiểm tra',
  })
  @ApiResponse({
    status: 200,
    description: 'Created successfully',
    type: GetListCheckListTemplateResponseDto,
  })
  async getList(
    @Query() query: GetListCheckListTemplateRequestDto,
  ): Promise<any> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.checkListTemplateService.getList(request);
  }

  //@MessagePattern('detail_check_list_template')
  @Get('/check-list-templates/:id')
  @ApiOperation({
    tags: ['Check List Template'],
    summary: 'Detail Check List Template',
    description: 'Detail Check List Template',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CheckListTemplateDetailResponseDto,
  })
  async detail(@Param() param: DetailCheclistTemplateRequestDto): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.checkListTemplateService.detail(request);
  }

  //@MessagePattern('update_check_list_template')
  @Put('/check-list-templates/:id')
  @ApiOperation({
    tags: ['Check List Template'],
    summary: 'Update Check List Template',
    description: 'Update an existing Check List Template',
  })
  @ApiResponse({
    status: 200,
    description: 'Update successfully',
    type: UpdateCheckListTemplateResponseDto,
  })
  async update(
    @Body() payload: UpdateCheckListTemplateRequestBodyDto,
    @Param() param: UpdateChecklistTemplateParamDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    const {
      request: { id },
      responseError: paramError,
    } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    if (paramError && !isEmpty(paramError)) {
      return responseError;
    }
    return await this.checkListTemplateService.update({
      ...request,
      id,
    });
  }

  //@MessagePattern('delete_check_list_template')
  @Delete('/check-list-templates/:id')
  @ApiOperation({
    tags: ['Check List Template'],
    summary: 'Delete Check List Template',
    description: 'Delete an existing Check List Template',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete successfully',
    type: SuccessResponse,
  })
  async delete(
    @Param() payload: DeleteCheclistTemplateRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return this.checkListTemplateService.delete(request);
  }

  //@MessagePattern('export_check_list_template')
  @Post('/check-list-templates/export')
  @ApiOperation({
    tags: ['Export Check List Template'],
    summary: 'Export Check List Template',
    description: 'Export Check List Template',
  })
  @ApiResponse({
    status: 200,
    description: 'Export successfully',
  })
  public async exportCheckListTemplate(
    @Body() payload: ExportCheckListTemplateRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.checkListTemplateService.exportCheckListTemplate(request);
  }
}
