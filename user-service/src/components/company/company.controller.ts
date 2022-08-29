import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { CompanyServiceInterface } from '@components/company/interface/company.service.interface';
import { MessagePattern } from '@nestjs/microservices';
import { ResponsePayload } from '@utils/response-payload';
import { isEmpty } from 'lodash';
import { CompanyRequestDto } from '@components/company/dto/request/company.request.dto';
import { GetListCompanyRequestDto } from '@components/company/dto/request/get-list-company.request.dto';
import { CompanyDataResponseDto } from '@components/company/dto/response/company-data.response.dto';
import { UpdateCompanyBodyRequestDto } from '@components/company/dto/request/update-company.request.dto';
import { GetListCompanyResponseDto } from '@components/company/dto/response/get-list-company.response.dto';
import { SetStatusRequestDto } from './dto/request/set-status.request.dto';
import { CompanyResponseDto } from './dto/response/company.response.dto';
import { FileUpdloadRequestDto } from '@core/dto/file-upload.request';
import {
  DetailRequestDto,
  GetListDataByCodes,
} from '@utils/common.request.dto';
import { PermissionCode } from '@core/decorator/get-code.decorator';
import {
  CONFIRM_COMPANY_PERMISSION,
  CREATE_COMPANY_PERMISSION,
  UPDATE_COMPANY_PERMISSION,
  DELETE_COMPANY_PERMISSION,
  DETAIL_COMPANY_PERMISSION,
  LIST_COMPANY_PERMISSION,
  REJECT_COMPANY_PERMISSION,
  IMPORT_COMPANY_PERMISSION,
} from '@utils/permissions/company';
import { DeleteMultipleDto } from '@core/dto/multiple/delete-multiple.dto';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ImportResponseDto } from '@core/dto/import/response/import.response.dto';
import { SuccessResponse } from '@utils/success.response.dto';

@Controller('companies')
export class CompanyController {
  constructor(
    @Inject('CompanyServiceInterface')
    private readonly companyService: CompanyServiceInterface,
  ) {}

  @PermissionCode(CREATE_COMPANY_PERMISSION.code)
  // @MessagePattern('company_create')
  @Post('/create')
  @ApiOperation({
    tags: ['Company'],
    summary: 'Create Company Type',
    description: 'Tạo mới công ty',
  })
  @ApiResponse({
    status: 200,
    description: 'Create successfully',
    type: CompanyDataResponseDto,
  })
  public async create(
    @Body() payload: CompanyRequestDto,
  ): Promise<ResponsePayload<CompanyDataResponseDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.companyService.create(request);
  }

  @PermissionCode(IMPORT_COMPANY_PERMISSION.code)
  @Post('/import')
  @ApiOperation({
    tags: ['Company'],
    summary: 'Import Company Type',
    description: 'Nhập một loạt company mới',
  })
  @ApiResponse({
    status: 200,
    description: 'Import successfully',
    type: ImportResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  // @MessagePattern('import_company')
  public async importCompany(
    @Body() body: FileUpdloadRequestDto,
  ): Promise<any> {
    const { request, responseError } = body;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.companyService.importCompany(request);
  }

  @PermissionCode(UPDATE_COMPANY_PERMISSION.code)
  @Put('/:id')
  @ApiOperation({
    tags: ['Company'],
    summary: 'Update Company Type',
    description: 'Sửa thông tin công ty',
  })
  @ApiResponse({
    status: 200,
    description: 'Update successfully',
    type: CompanyDataResponseDto,
  })
  // @MessagePattern('company_update')
  public async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() payload: UpdateCompanyBodyRequestDto,
  ): Promise<ResponsePayload<CompanyDataResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.companyService.update({ ...request, id });
  }

  @PermissionCode(DELETE_COMPANY_PERMISSION.code)
  @Delete('/:id')
  @ApiOperation({
    tags: ['Company'],
    summary: 'Delete Company Type',
    description: 'Xóa công ty',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete successfully',
    type: SuccessResponse,
  })
  // @MessagePattern('company_delete')
  public async delete(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ResponsePayload<any>> {
    return await this.companyService.delete(id);
  }

  @PermissionCode(DELETE_COMPANY_PERMISSION.code)
  // @MessagePattern('company_delete_multiple')
  @Delete('/multiple')
  @ApiOperation({
    tags: ['Company'],
    summary: 'Delete multiple Company Type',
    description: 'Xóa nhiều công ty',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete successfully',
    type: SuccessResponse,
  })
  public async deleteMultiple(
    @Query() payload: DeleteMultipleDto,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.companyService.deleteMultiple(request);
  }

  @PermissionCode(DETAIL_COMPANY_PERMISSION.code)
  @Get('/:id')
  @ApiOperation({
    tags: ['Company'],
    summary: 'Detail Company Type',
    description: 'Chi tiết công ty',
  })
  @ApiResponse({
    status: 200,
    description: 'Get Detail successfully',
    type: CompanyDataResponseDto,
  })
  public async getDetail(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<ResponsePayload<CompanyDataResponseDto | any>> {
    return await this.companyService.getDetail(id);
  }

  @PermissionCode(LIST_COMPANY_PERMISSION.code)
  @Get('/list')
  @ApiOperation({
    tags: ['Company'],
    summary: 'List Company Type',
    description: 'Danh sách công ty',
  })
  @ApiResponse({
    status: 200,
    description: 'Get List successfully',
    type: GetListCompanyResponseDto,
  })
  public async getList(
    @Query() payload: GetListCompanyRequestDto,
  ): Promise<ResponsePayload<GetListCompanyResponseDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.companyService.getList(request);
  }

  @PermissionCode(CONFIRM_COMPANY_PERMISSION.code)
  // @MessagePattern('confirm_company')
  @Put('/:id/confirm')
  @ApiOperation({
    tags: ['Company'],
    summary: 'Confirm Company',
    description: 'Xác nhận công ty',
  })
  @ApiResponse({
    status: 200,
    description: 'Confirm successfully',
    type: CompanyDataResponseDto,
  })
  public async confirm(
    @Req() payload: SetStatusRequestDto,
  ): Promise<ResponsePayload<CompanyResponseDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.companyService.confirm(request);
  }

  @PermissionCode(REJECT_COMPANY_PERMISSION.code)
  // @MessagePattern('reject_company')
  @Put('/:id/reject')
  @ApiOperation({
    tags: ['Company'],
    summary: 'Reject Company',
    description: 'từ chối xác nhận công ty',
  })
  @ApiResponse({
    status: 200,
    description: 'Reject successfully',
    type: CompanyDataResponseDto,
  })
  public async reject(
    @Req() payload: SetStatusRequestDto,
  ): Promise<ResponsePayload<CompanyResponseDto | any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.companyService.reject(request);
  }

  @MessagePattern('get_list_company_by_codes')
  public async getListCompanyByCodes(
    @Body() payload: GetListDataByCodes,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.companyService.getListCompanyByCodes(request.codes);
  }
  // @TODO: Remove after refactor done
  @MessagePattern('get_list_company_by_codes')
  public async getListCompanyByCodesTcp(
    @Body() payload: GetListDataByCodes,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.companyService.getListCompanyByCodes(request.codes);
  }

  @PermissionCode(DETAIL_COMPANY_PERMISSION.code)
  @MessagePattern('company_detail')
  public async getDetailTcp(
    @Body() payload: DetailRequestDto,
  ): Promise<ResponsePayload<CompanyDataResponseDto | any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.companyService.getDetail(request.id);
  }
}
