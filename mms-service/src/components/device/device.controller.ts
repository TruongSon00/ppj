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
  Patch,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { isEmpty } from 'lodash';
import { GetListDevicesRequestDto } from '@components/device/dto/request/list-devices.request.dto';
import { GetDetailDeviceRequestDto } from '@components/device/dto/request/detail-device.request.dto';
import { ScanQrDeviceRequestDto } from '@components/device/dto/request/scan-qr-device.request.dto';
import { DeviceServiceInterface } from '@components/device/interface/device.service.interface';
import { CreateDeviceRequestDto } from '@components/device/dto/request/create-device.request.dto';
import { ConfirmDeviceRequestDto } from '@components/device/dto/request/confirm-device.request.dto';
import { DeleteDeviceRequestDto } from '@components/device/dto/request/delete-device.request.dto';
import { UpdateDeviceRequestDto } from '@components/device/dto/request/update-device.request.dto';
import { ListJobByDeviceRequestDto } from '@components/job/dto/request/list-job-by-device.request.dto';
import {
  GetMaintainInfoByDeviceParam,
  GetMaintainInfoByDeviceRequest,
} from './dto/request/get-maintain-info-by-device.request.dto';
import { ExportDeviceRequestDto } from '@components/device/dto/request/export-device.request.dto';
import { GetDetailDeviceAppInfoRequestDto } from './dto/request/detail-device-app-info.request.dto';
import { DeviceMaintenanceInfoAppRequestDto } from './dto/request/device-maintenance-info-app.request.dto';
import { DeviceMaintenanceHistoryAppRequestDto } from './dto/request/device-maintenance-history-app.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetListDevicesAppResponseDto } from './dto/response/get-list-devices-app.response.dto';
import { DeviceCommonInfoResponseDto } from './dto/response/device-detail/device-common-info-response.dto';
import { DeviceDetailInfoAppResponseDto } from './dto/response/device-detail/device-detail-info-app.response.dto';
import { GetMaintainInfoByDeviceResponse } from './dto/response/get-maintain-info-by-device.response.dto';
import { DetailDeviceWebResponseDto } from './dto/response/detail-device.web.response.dto';
import { ListJobByDeviceResponse } from './dto/response/list-job-by-device.response.dto';
import {
  CONFIRM_DEVICE_PERMISSION,
  CREATE_DEVICE_PERMISSION,
  DELETE_DEVICE_PERMISSION,
  DETAIL_DEVICE_PERMISSION,
  EXPORT_DEVICE_PERMISSION,
  LIST_DEVICE_PERMISSION,
  UPDATE_DEVICE_PERMISSION,
} from '@utils/permissions/device';
import { PermissionCode } from '@core/decorator/get-code.decorator';

@Injectable()
@Controller()
export class DeviceController {
  constructor(
    @Inject('DeviceServiceInterface')
    private readonly deviceService: DeviceServiceInterface,
  ) {}

  /* APIs for app */
  //@MessagePattern('device_list_app')
  @PermissionCode(LIST_DEVICE_PERMISSION.code)
  @Get('/app/devices')
  @ApiOperation({
    tags: ['Devices'],
    summary: 'Danh sách thiết bị',
    description: 'Danh sách thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GetListDevicesAppResponseDto,
  })
  async getListApp(@Query() query: GetListDevicesRequestDto): Promise<any> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceService.getListApp(request);
  }

  //@MessagePattern('device_scan_qr')
  @ApiOperation({
    tags: ['Devices'],
    summary: 'Quét mã QR thiết bị',
    description: 'Quét mã QR thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DeviceCommonInfoResponseDto,
  })
  @Get('/devices/qr-codes/scan')
  async scanQrCode(@Query() query: ScanQrDeviceRequestDto): Promise<any> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceService.scanQrCode(request);
  }

  //@MessagePattern('device_detail_app_info')
  @ApiOperation({
    tags: ['Devices'],
    summary: 'Thông tin chi tiết thiết bị',
    description: 'Thông tin chi tiết thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DeviceDetailInfoAppResponseDto,
  })
  @Get('/app/devices/:id')
  async getDetailAppInfo(
    @Param() payload: GetDetailDeviceAppInfoRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceService.getDetailApp(request);
  }

  //@MessagePattern('device_maintenance_info_app')
  @ApiOperation({
    tags: ['Devices'],
    summary: 'Thông số bảo trì thiết bị',
    description: 'Thông số bảo trì thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GetMaintainInfoByDeviceResponse,
  })
  @Get('/app/devices/:serial/maintenance-info')
  async getDeviceMaintenanceInfoApp(
    @Param() param: DeviceMaintenanceInfoAppRequestDto,
  ): Promise<any> {
    const { request, responseError } = param;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceService.getMaintenanceInfoApp(request);
  }

  /* APIs for app */

  /* APIs for web */
  //@MessagePattern('device_list_web')
  @ApiOperation({
    tags: ['Devices'],
    summary: 'Danh sách thiết bị',
    description: 'Danh sách thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: [GetListDevicesAppResponseDto],
  })
  @Get('/web/devices')
  async getList(@Query() query: GetListDevicesRequestDto): Promise<any> {
    const { request, responseError } = query;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceService.getList(request);
  }

  //@MessagePattern('device_create')
  @PermissionCode(CREATE_DEVICE_PERMISSION.code)
  @Post('/web/devices')
  @ApiOperation({
    tags: ['Devices'],
    summary: 'Tạo thiết bị',
    description: 'Tạo thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Number,
  })
  async create(@Body() payload: CreateDeviceRequestDto): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceService.create(request);
  }

  //@MessagePattern('device_confirm')
  @PermissionCode(CONFIRM_DEVICE_PERMISSION.code)
  @ApiOperation({
    tags: ['Devices'],
    summary: 'Xác nhận thiết bị',
    description: 'Xác nhận thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: String,
  })
  @Patch('/web/devices/:id')
  async confirm(@Param() payload: ConfirmDeviceRequestDto): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceService.confirm(request);
  }

  //@MessagePattern('device_delete')
  @PermissionCode(DELETE_DEVICE_PERMISSION.code)
  @ApiOperation({
    tags: ['Devices'],
    summary: 'Xóa thiết bị',
    description: 'Xóa thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @Delete('/web/devices/:id')
  async delete(@Param() payload: DeleteDeviceRequestDto): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceService.delete(request);
  }

  //@MessagePattern('device_detail_web')
  @PermissionCode(DETAIL_DEVICE_PERMISSION.code)
  @ApiOperation({
    tags: ['Devices'],
    summary: 'Chi tiết thiết bị',
    description: 'Chi tiết thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DetailDeviceWebResponseDto,
  })
  @Get('/web/devices/:id')
  async detailWeb(@Param() payload: GetDetailDeviceRequestDto): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceService.getDetailWeb(request);
  }

  //@MessagePattern('device_update')
  @PermissionCode(UPDATE_DEVICE_PERMISSION.code)
  @ApiOperation({
    tags: ['Devices'],
    summary: 'Sửa thiết bị',
    description: 'Sửa thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: String,
  })
  @Put('/web/devices')
  async update(@Body() payload: UpdateDeviceRequestDto): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceService.update(request);
  }

  //@MessagePattern('device_list_all')
  @ApiOperation({
    tags: ['Devices'],
    summary: 'Danh sách tất cả thiết bị',
    description: 'Danh sách tất cả thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @Get('/devices/all-devices')
  async getAll(): Promise<any> {
    return await this.deviceService.getAll();
  }
  /* APIs for web */

  //@MessagePattern('list_job_by_device')
  @Get('/devices/:serial/jobs')
  @ApiOperation({
    tags: ['Scan Job', 'MMS'],
    summary: '',
    description: 'Danh Sách công việc của thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'List Job By device successfully',
    type: ListJobByDeviceResponse,
  })
  async listJobByDevice(
    @Query() payload: ListJobByDeviceRequestDto,
    @Param('serial') serial: string,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.serial = serial;
    return await this.deviceService.listJobByDevice(request);
  }

  //@MessagePattern('get_maintain_info_by_device')
  @Get('/devices/assign-device/:id/maintain-info')
  @ApiOperation({
    tags: ['get maintain info by assign device'],
    summary: 'Get maintain info by assign device',
    description: 'Lấy danh sách thông tin bảo trì theo mã phân công thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Get successfully',
    type: GetMaintainInfoByDeviceResponse,
  })
  async getMaintainInfoByDevice(
    @Query() payload: GetMaintainInfoByDeviceRequest,
    @Param() param: GetMaintainInfoByDeviceParam,
  ): Promise<any> {
    const { request, responseError } = param;
    const { request: query } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceService.getMaintainInfoByDevice({
      ...request,
      ...query,
    });
  }

  //@MessagePattern('device_maintenance_history_app')
  @ApiOperation({
    tags: ['Devices'],
    summary: 'Lịch sử bảo trì thiết bị',
    description: 'Lịch sử bảo trì thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: null,
  })
  @Get('/app/devices/:serial/maintenance-histories')
  async getDeviceMaintenanceHistoryApp(
    @Param() payload: DeviceMaintenanceHistoryAppRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceService.getMaintenanceHistoryApp(request);
  }

  //@MessagePattern('export_device')
  @PermissionCode(EXPORT_DEVICE_PERMISSION.code)
  @Post('devices/export')
  @ApiOperation({
    tags: ['Export Device'],
    summary: 'Export Device',
    description: 'Export Device',
  })
  @ApiResponse({
    status: 200,
    description: 'Export successfully',
  })
  public async exportDevice(
    @Body() payload: ExportDeviceRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceService.exportDevice(request);
  }
}
