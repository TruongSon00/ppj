import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { isEmpty } from 'lodash';
import { DetailVendorRequestDto } from './dto/request/detail-vendor.request.dto';
import { GetListVendorRequestDto } from './dto/request/get-list-vendor.request.dto';
import { VendorServiceInterface } from './interface/vendor.service.interface';

@Controller('vendors')
export class VendorController {
  constructor(
    @Inject('VendorServiceInterface')
    private readonly vendorService: VendorServiceInterface,
  ) {}

  @Get('/:id')
  @ApiOperation({
    tags: ['Vendor'],
    summary: 'Detail Vendor',
    description: 'Detail Vendor',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    // type: GetDetailSupplyGroupResponseDto,
  })
  async detail(@Param() param: DetailVendorRequestDto): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.vendorService.detail(request);
  }

  @Get('')
  @ApiOperation({
    tags: ['Vendor'],
    summary: 'List Of Vendor',
    description: 'List Of Vendor',
  })
  @ApiResponse({
    status: 200,
    description: 'Get List successfully',
    type: null,
  })
  async getList(@Query() payload: GetListVendorRequestDto): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.vendorService.getList(request);
  }
}
