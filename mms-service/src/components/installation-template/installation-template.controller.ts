import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Injectable,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessResponse } from '@utils/success.response.dto';
import { isEmpty } from 'lodash';
import { GetListInstallationTemplateQuery } from './dto/query/get-list-installation-template.query';
import { CreateInstallationTemplateRequest } from './dto/request/create-installation-template.request';
import { DetailInstallationTemplateRequest } from './dto/request/detail-installation-template.request';
import {
  UpdateInstallationTemplateBodyDto,
  UpdateInstallationTemplateRequest,
} from './dto/request/update-installation-template.request';
import { DetailInstallationTemplateResponse } from './dto/response/detail-installation-template.response';
import { InstallationTemplateServiceInterface } from './interface/installation-template.service.interface';

@Injectable()
@Controller('installation-template')
export class InstallationTemplateController {
  constructor(
    @Inject('InstallationTemplateServiceInterface')
    private readonly installationTemplateService: InstallationTemplateServiceInterface,
  ) {}

  // @MessagePattern('create_installation_template')
  @Post('')
  @ApiOperation({
    tags: ['Create Installation template'],
    summary: 'Tạo phiếu lắp đặt',
    description: 'Tạo phiếu lắp đặt',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async create(
    @Body() payload: CreateInstallationTemplateRequest,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.installationTemplateService.create(request);
  }

  // @MessagePattern('detail_installation_template')
  @Get('/:id')
  @ApiOperation({
    tags: ['Detail installation template'],
    summary: 'Chi tiết phiếu lắp đặt',
    description: 'Chi tiết phiếu lắp đặt',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DetailInstallationTemplateResponse,
  })
  async detail(
    @Param() param: DetailInstallationTemplateRequest,
  ): Promise<any> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.installationTemplateService.detail(request);
  }

  // @MessagePattern('delete_installation_template')
  @Delete('/:id')
  @ApiOperation({
    tags: ['Delete installation template'],
    summary: 'Xóa phiếu lắp đặt',
    description: 'Xóa phiếu lắp đặt',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async delete(
    @Param() param: DetailInstallationTemplateRequest,
  ): Promise<any> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.installationTemplateService.delete(request);
  }

  // @MessagePattern('update_installation_template')
  @Put('/:id')
  @ApiOperation({
    tags: ['UpdateInstallation template'],
    summary: 'Cập nhật phiếu lắp đặt',
    description: 'Cập nhật phiếu lắp đặt',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateInstallationTemplateBodyDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.id = id;
    return await this.installationTemplateService.update(request);
  }

  // @MessagePattern('list_installation_template')
  @Get('')
  @ApiOperation({
    tags: ['List installation'],
    summary: 'Danh sách phiếu lắp đặt',
    description: 'Danh sách phiếu lắp đặt',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: null,
  })
  async list(@Query() payload: GetListInstallationTemplateQuery): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.installationTemplateService.list(request);
  }
}
