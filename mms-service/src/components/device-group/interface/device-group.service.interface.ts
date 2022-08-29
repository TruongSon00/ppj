import { UpdateDeviceGroupRequestDto } from '@components/device-group/dto/request/update-device-group.request.dto';
import { GetListDeviceGroupRequestDto } from '@components/device-group/dto/request/get-list-device-group.request.dto';
import { DetailDeviceGroupRequestDto } from '../dto/request/detail-device-group.request.dto';
import { UpdateUnitActiveStatusPayload } from '@components/unit/dto/request/update-unit-status.request';

export interface DeviceGroupServiceInterface {
  getList(request: GetListDeviceGroupRequestDto): Promise<any>;
  create(payload: any): Promise<any>;
  detail(request: DetailDeviceGroupRequestDto): Promise<any>;
  update(request: UpdateDeviceGroupRequestDto): Promise<any>;
  createMany(request: any): Promise<{ dataSuccess: any[]; dataError: any[] }>;
  updateStatus(request: UpdateUnitActiveStatusPayload): Promise<any>;
}
