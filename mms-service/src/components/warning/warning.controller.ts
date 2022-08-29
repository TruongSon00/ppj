import {
  Controller,
  Injectable,
  Get,
  Inject,
  Put,
  Param,
  Query,
} from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { WarningServiceInterface } from './interface/warning.service.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateWarningDto } from './dto/request/create-warning.dto';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty } from 'lodash';
import { CreateWarningDataResponseDto } from './dto/response/create-warning-data.response.dto';
import { DetailWarningDataResponseDto } from './dto/response/detail-warning-data.response.dto';
import { GetListWarningRequestDto } from './dto/request/list-warning.request.dto';
import { SuccessResponse } from '@utils/success.response.dto';
import { RejectWarningBodyDto } from './dto/request/reject-warning.request.dto';
import { ApproveWarningRequestDto } from '@components/job/dto/request/approve-warning.request.dto';
import { DetailWarningRequestDto } from './dto/request/detail-warning.dto';
import {
  APPROVE_WARNING_PERMISSION,
  DETAIL_WARNING_PERMISSION,
  LIST_WARNING_PERMISSION,
  REJECT_WARNING_PERMISSION,
} from '@utils/permissions/warning';
import { PermissionCode } from '@core/decorator/get-code.decorator';
@Injectable()
@Controller()
export class WarningController {
  constructor(
    @Inject('WarningServiceInterface')
    private readonly warningService: WarningServiceInterface,
  ) {}

  @Post('warnings')
  @ApiOperation({
    tags: ['Warning'],
    summary: 'Create new item',
    description: 'Tạo 1 item mới',
  })
  @ApiResponse({
    status: 200,
    description: 'Create successfully',
    type: null,
  })
  // @MessagePattern('create_warning')
  async register(
    @Body() payload: CreateWarningDto,
  ): Promise<ResponsePayload<CreateWarningDataResponseDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.warningService.createWarning(request);
  }

  @PermissionCode(DETAIL_WARNING_PERMISSION.code)
  @Get('warnings/:id')
  @ApiOperation({
    tags: ['Warning'],
    summary: 'Detail item',
    description: 'Chi tiết item',
  })
  @ApiResponse({
    status: 200,
    description: 'Detail Item',
    type: DetailWarningDataResponseDto,
  })
  // @MessagePattern('detail_warning')
  async detail(
    @Param() param: DetailWarningRequestDto,
  ): Promise<ResponsePayload<DetailWarningDataResponseDto | any>> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.warningService.detailWarning(request);
  }

  // @MessagePattern('list_warning')
  @PermissionCode(LIST_WARNING_PERMISSION.code)
  @Get('/warnings')
  @ApiOperation({
    tags: ['Warning', 'MMS'],
    summary: '',
    description: 'Danh sách cảnh báo lỗi',
  })
  @ApiResponse({
    status: 200,
    description: 'List Warning successfully',
    type: null,
  })
  async listWarning(
    @Query() payload: GetListWarningRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.warningService.getListWarning(request);
  }

  @PermissionCode(REJECT_WARNING_PERMISSION.code)
  @Put('warning/:id/reject')
  @ApiOperation({
    tags: ['Job', 'MMS'],
    summary: '',
    description: 'Từ chối cảnh báo',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully',
    type: SuccessResponse,
  })
  // @MessagePattern('reject_warning')
  async rejectWarning(
    @Param('id') id: string,
    @Body() body: RejectWarningBodyDto,
  ): Promise<any> {
    const { request, responseError } = body;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.warningService.warningReject(request);
  }

  @PermissionCode(APPROVE_WARNING_PERMISSION.code)
  @Put('warning/:id/approve')
  @ApiOperation({
    tags: ['Job', 'MMS'],
    summary: '',
    description: 'Xác nhận cảnh báo',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully',
    type: SuccessResponse,
  })
  @MessagePattern('approve_warning')
  async approveWarning(@Param() param: ApproveWarningRequestDto): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.warningService.warningApprove(request);
  }
}
