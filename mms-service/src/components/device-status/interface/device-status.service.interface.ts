import { ResponsePayload } from '@utils/response-payload';
import { ListDeviceStatusQuery } from '../dto/query/list-device-status.query';
import { CreateDeviceStatusActivityRequestDto } from '../dto/request/create-device-status-activity.request.dto';
import { ListDeviceStatusActivityInfoRequestDto } from '../dto/request/list-device-status-activity-info.request.dto';
import { ListDeviceStatusBySerialRequestDto } from '../dto/request/list-device-status-by-serial.request.dto';

export interface DeviceStatusServiceInterface {
  listDeviceStatusActivityInfo(
    request: ListDeviceStatusActivityInfoRequestDto,
  ): Promise<any>;
  createDeviceStatusActivity(
    request: CreateDeviceStatusActivityRequestDto,
    userId?: number,
  ): Promise<ResponsePayload<any>>;
  list(request: ListDeviceStatusQuery): Promise<ResponsePayload<any>>;
  listDeviceStatusBySerial(
    request: ListDeviceStatusBySerialRequestDto,
  ): Promise<any>;
}
