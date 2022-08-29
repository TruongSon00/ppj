import { ListSerialByDeviceIds } from './dto/request/list-device-assignment-by-device-ids.request.dto';
import {
  Controller,
  Injectable,
  Inject,
  Body,
  Query,
  Param,
  Get,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { isEmpty } from 'lodash';
import { DeviceAssignRequestDto } from './dto/request/device-assign.request.dto';
import { DeviceAssignmentServiceInterface } from './interface/device-assignment.service.interface';
import { GetListDeviceAssignmentRequestDto } from './dto/request/list-device-assignment.request.dto';
import { UpdateDeviceAssignRequestBodyDto } from './dto/request/update-device-assign.request.dto';
import { GetDeviceAssignRequestDto } from './dto/request/get-device-assign.request.dto';
import { ImportDeviceAssignRequestDto } from './dto/request/import-device-assign.dto';
import { GenerateQrCodeSerialRequest } from './dto/request/generate-qr-code-serial.request.dto';
import { ExportDeviceAssignRequestDto } from './dto/request/export-device-assign.dto';
import { GenerateSerialRequest } from './dto/request/generate-serial.request';
import { ValidateSerialRequest } from './dto/request/validate-serial.request';
import { ListSerialRequest } from './dto/request/list-serial.request.dto';
import { UpdateOperationTimeBySerial } from './dto/request/update-operation-time-by-serial';
import { ListSerialByDeviceQuery } from './dto/query/list-serial-by-device.query';
import { getMoList } from './dto/request/get-mo-list.dto';
import { GetLogTimeByMoId } from './dto/request/get-log-time-by-mo-id.dto';
import { GetDeviceAssignmentByWorkCenterId } from './dto/request/get-device-assignment-by-work-center.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeviceAssignmentResponseDto } from './dto/response/list_device_assignment.response.dto';
import { GetDeviceAssignResponseDto } from './dto/response/get-device-assign.response.dto';
import { ImportDeviceAssignResponseDto } from './dto/response/import-device-assignment.response.dto';
import { GenerateQrCodeSerialResponse } from './dto/response/generate-qr-code-serial.response.dto';
import { SuccessResponse } from '@utils/success.response.dto';
import { ListSerialByDeviceResponse } from './dto/response/list-serial-by-device.response';
import { GetLogTimeByMoIdResponse } from './dto/response/get-log-time-by-mo-id.response.dto';
import {
  CREATE_DEVICE_ASSIGNMENT_PERMISSION,
  DELETE_DEVICE_ASSIGNMENT_PERMISSION,
  DETAIL_DEVICE_ASSIGNMENT_PERMISSION,
  GENERATE_QR_CODE_SERIAL_DEVICE_ASSIGNMENT_PERMISSION,
  LIST_DEVICE_ASSIGNMENT_PERMISSION,
  UPDATE_DEVICE_ASSIGNMENT_PERMISSION,
} from '@utils/permissions/device-assignment';
import { PermissionCode } from '@core/decorator/get-code.decorator';

@Injectable()
@Controller()
export class DeviceAssignmentController {
  constructor(
    @Inject('DeviceAssignmentServiceInterface')
    private readonly deviceAssignmentService: DeviceAssignmentServiceInterface,
  ) {}

  @PermissionCode(LIST_DEVICE_ASSIGNMENT_PERMISSION.code)
  @Get('device-assignment/list')
  @ApiOperation({
    tags: ['Device Assignment'],
    summary: 'List item',
    description: 'Danh sách phân công thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'List Item',
    type: [DeviceAssignmentResponseDto],
  })
  async deviceAssignment(
    @Query() query: GetListDeviceAssignmentRequestDto,
  ): Promise<any> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceAssignmentService.listDeviceAssignment(request);
  }

  @PermissionCode(CREATE_DEVICE_ASSIGNMENT_PERMISSION.code)
  @Post('/devices/assign-device')
  @ApiOperation({
    tags: ['assign device', 'create assign device'],
    summary: 'Create assign device',
    description: 'Tạo phân công thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Created successfully',
    type: DeviceAssignmentResponseDto,
  })
  async createAssignDevice(
    @Body() payload: DeviceAssignRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceAssignmentService.createAssignDevice(request);
  }

  @PermissionCode(UPDATE_DEVICE_ASSIGNMENT_PERMISSION.code)
  @Put('/devices/assign-device/:id')
  @ApiOperation({
    tags: ['assign device', 'update assign device'],
    summary: 'Update assign device',
    description: 'Sửa phân công thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Update successfully',
    type: DeviceAssignmentResponseDto,
  })
  async updateAssignDevice(
    @Body() payload: UpdateDeviceAssignRequestBodyDto,
    @Param('id') id: string,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.id = id;
    return await this.deviceAssignmentService.updateAssignDevice(request);
  }

  @PermissionCode(DETAIL_DEVICE_ASSIGNMENT_PERMISSION.code)
  @Get('/devices/assign-device/:id')
  @ApiOperation({
    tags: ['assign device', 'get assign device'],
    summary: 'Get assign device',
    description: 'Lấy chi tiết phân công thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Get successfully',
    type: GetDeviceAssignResponseDto,
  })
  async getAssignDevice(
    @Param() param: GetDeviceAssignRequestDto,
  ): Promise<any> {
    const { request, responseError } = param;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceAssignmentService.getAssignDevice(request);
  }

  @PermissionCode(DELETE_DEVICE_ASSIGNMENT_PERMISSION.code)
  @Delete('/devices/assign-device/:id')
  @ApiOperation({
    tags: ['assign device', 'delete assign device'],
    summary: 'Delete assign device',
    description: 'Xóa phân công thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete successfully',
    type: GetDeviceAssignResponseDto,
  })
  async delete(@Param() payload: GetDeviceAssignRequestDto): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceAssignmentService.delete(request);
  }

  @Post('/device-assignments/import')
  @ApiOperation({
    tags: ['Supply'],
    summary: 'Import assign device',
    description: 'Import assign device',
  })
  @ApiResponse({
    status: 200,
    description: 'Created successfully',
    type: ImportDeviceAssignResponseDto,
  })
  async importAssignDevice(
    @Body() payload: ImportDeviceAssignRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceAssignmentService.importAssignDevice(request);
  }

  @PermissionCode(GENERATE_QR_CODE_SERIAL_DEVICE_ASSIGNMENT_PERMISSION.code)
  @Post('/devices/assign-device/generate-qr-code')
  @ApiOperation({
    tags: ['qr code', 'generate qr code serial'],
    summary: 'Generate qr code serial',
    description: 'Tạo mã qr code serial',
  })
  @ApiResponse({
    status: 200,
    description: 'Generate successfully',
    type: GenerateQrCodeSerialResponse,
  })
  async generateQrCodeSerial(
    @Body() payload: GenerateQrCodeSerialRequest,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceAssignmentService.generateQrCodeSerial(request);
  }

  @Get('/device-assignments/export')
  @ApiOperation({
    tags: ['Supply'],
    summary: 'Export assign device',
    description: 'Export assign device',
  })
  @ApiResponse({
    status: 200,
    description: 'Created successfully',
    type: SuccessResponse,
  })
  async exportAssignDevice(
    @Query() payload: ExportDeviceAssignRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceAssignmentService.exportAssignDevice(request);
  }

  @Post('/generate-serial')
  @ApiOperation({
    tags: ['suggest serial'],
    summary: 'Gợi ý mã serial',
    description: 'Gợi ý mã serial',
  })
  @ApiResponse({
    status: 200,
    description: 'Generate successfully',
    type: SuccessResponse,
  })
  async generateSerial(@Body() payload: GenerateSerialRequest): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceAssignmentService.generateSerial(request);
  }

  @Post('/validate-serial')
  @ApiOperation({
    tags: ['validate serial'],
    summary: 'Kiểm tra mã serial',
    description: 'Kiểm tra mã serial',
  })
  @ApiResponse({
    status: 200,
    description: 'Validate successfully',
  })
  async validateSerial(@Body() payload: ValidateSerialRequest): Promise<any> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceAssignmentService.validateSerial(request);
  }

  @Get('device-assignment/serials-in-use')
  @ApiOperation({
    tags: ['Device Assignment'],
    summary: 'List item',
    description: 'Danh sách serial phân công thiết bị được sử dụng',
  })
  @ApiResponse({
    status: 200,
    description: 'List Item',
  })
  async serialsList(@Query() query: ListSerialRequest): Promise<any> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceAssignmentService.listSerial(request);
  }

  @Put('/device-assignments/operation-time')
  @ApiOperation({
    tags: ['Device Assignment'],
    summary: 'cập nhật thời gian hoạt động của thiết bị theo serial',
    description: 'Danh sách serial phân công thiết bị được sử dụng',
  })
  @ApiResponse({
    status: 200,
    description: 'Update operation time',
  })
  async updateOperationTimeBySerial(
    @Body() payload: UpdateOperationTimeBySerial,
  ) {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceAssignmentService.updateOperationTimeBySerial(
      request,
    );
  }

  @Get('/serial-by-device')
  @ApiOperation({
    tags: ['List serial'],
    summary: 'Danh sách mã serial theo thiết bị và trạng thái',
    description: 'Danh sách mã serial theo thiết bị và trạng thái',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ListSerialByDeviceResponse,
  })
  async listSerialByDevice(
    @Query() query: ListSerialByDeviceQuery,
  ): Promise<any> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.deviceAssignmentService.listSerialByDevice(request);
  }

  @Get('device-assignment/serial-by-device')
  @ApiOperation({
    tags: ['List serial'],
    summary: 'Danh sách mã serial theo thiết bị và trạng thái',
    description: 'Danh sách mã serial theo thiết bị và trạng thái',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ListSerialByDeviceResponse,
  })
  async listSerialByDeviceIds(
    @Query() payload: ListSerialByDeviceIds,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceAssignmentService.listSerialByDeviceIds(request);
  }

  @Get('/device-assignments/mo-information')
  @ApiOperation({
    tags: ['Device Assignment'],
    summary: 'danh sách mo theo xưởng & plan',
    description: 'danh sách mo theo xưởng & plan',
  })
  @ApiResponse({
    status: 200,
    description: 'success',
    type: null,
  })
  async getMoList(@Query() payload: getMoList): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceAssignmentService.getMoList(request);
  }

  @Get('device-assignments/manufacturing-information')
  @ApiOperation({
    tags: ['Device Assignment'],
    summary: 'get log time theo mo',
    description: 'get log time theo mo',
  })
  @ApiResponse({
    status: 200,
    description: 'success',
    type: GetLogTimeByMoIdResponse,
  })
  async getLogTimeByMoId(@Query() query: GetLogTimeByMoId): Promise<any> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceAssignmentService.getLogTimeByMoId(request);
  }

  @Get('/devices/assign-device/:id/attribute-type')
  @ApiOperation({
    tags: ['assign device', 'get attribute type of assign device'],
    summary: 'Get attribute type of assign device',
    description: 'Lấy danh sách thuộc tính của phân công thiết bị',
  })
  @ApiResponse({
    status: 200,
    description: 'Get successfully',
    type: null,
  })
  async getAttributeTypeByDeviceAssign(
    @Param() payload: GetDeviceAssignRequestDto,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.deviceAssignmentService.getAttributeTypeByDeviceAssign(
      request,
    );
  }

  @MessagePattern('get_device_assignment_by_work_center_id')
  async getDeviceAssignmentByWorkCenterId(
    @Body() payload: GetDeviceAssignmentByWorkCenterId,
    @Param('id') id: string,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    request.id = id;
    return await this.deviceAssignmentService.getDeviceAssignmentByWorkCenterId(
      request,
    );
  }
}
