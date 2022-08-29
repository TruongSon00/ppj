import { GetListDevicesRequestDto } from '@components/device/dto/request/list-devices.request.dto';
import { ScanQrDeviceRequestDto } from '@components/device/dto/request/scan-qr-device.request.dto';
import { ResponsePayload } from '@utils/response-payload';
import { PagingResponse } from '@utils/paging.response';
import { CreateDeviceRequestDto } from '@components/device/dto/request/create-device.request.dto';
import { ConfirmDeviceRequestDto } from '@components/device/dto/request/confirm-device.request.dto';
import { UpdateDeviceRequestDto } from '@components/device/dto/request/update-device.request.dto';
import { ListJobByDeviceRequestDto } from '@components/job/dto/request/list-job-by-device.request.dto';
import { Device } from 'src/models/device/device.model';
import { DetailDeviceWebResponseDto } from '@components/device/dto/response/detail-device.web.response.dto';
import { GetMaintainInfoByDeviceRequest } from '../dto/request/get-maintain-info-by-device.request.dto';
import { ExportDeviceRequestDto } from '@components/device/dto/request/export-device.request.dto';
import { DeleteDeviceRequestDto } from '../dto/request/delete-device.request.dto';
import { GetDetailDeviceAppInfoRequestDto } from '../dto/request/detail-device-app-info.request.dto';
import { DeviceMaintenanceInfoAppRequestDto } from '../dto/request/device-maintenance-info-app.request.dto';
import { DeviceMaintenanceHistoryAppRequestDto } from '../dto/request/device-maintenance-history-app.request.dto';

export interface DeviceServiceInterface {
  getList(
    request: GetListDevicesRequestDto,
  ): Promise<ResponsePayload<PagingResponse>>;
  create(request: CreateDeviceRequestDto): Promise<ResponsePayload<unknown>>;
  getDetailWeb(
    id: string,
  ): Promise<ResponsePayload<DetailDeviceWebResponseDto>>;
  update(request: UpdateDeviceRequestDto): Promise<ResponsePayload<unknown>>;
  getListApp(request: GetListDevicesRequestDto): Promise<any>;
  scanQrCode(request: ScanQrDeviceRequestDto): Promise<any>;
  confirm(request: ConfirmDeviceRequestDto): Promise<ResponsePayload<unknown>>;
  delete(request: DeleteDeviceRequestDto): Promise<ResponsePayload<unknown>>;
  getDetailApp(request: GetDetailDeviceAppInfoRequestDto): Promise<any>;
  getMaintenanceInfoApp(
    request: DeviceMaintenanceInfoAppRequestDto,
  ): Promise<any>;
  listJobByDevice(params: ListJobByDeviceRequestDto): Promise<any>;
  getAll(): Promise<ResponsePayload<Device[]>>;
  findOneById(id: string): Promise<ResponsePayload<Device>>;
  getMaintainInfoByDevice(
    request: GetMaintainInfoByDeviceRequest,
  ): Promise<ResponsePayload<any>>;
  getMaintenanceHistoryApp(
    request: DeviceMaintenanceHistoryAppRequestDto,
  ): Promise<any>;
  exportDevice(request: ExportDeviceRequestDto): Promise<any>;
  findOneByCode(code: string): Promise<ResponsePayload<Device>>;
  updateDeviceIndex(deviceId: string): Promise<any>;
}
