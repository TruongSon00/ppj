import { CreateDeviceRequestTicketRequestDto } from '@components/device-request/dto/request/request-ticket/create-device-request-ticket.request.dto';
import { ListDeviceRequestsRequestDto } from '@components/device-request/dto/request/list-device-requests.request.dto';
import { UpdateStatusDeviceRequestRequestDto } from '../dto/request/request-ticket/update-status-device-request.request.dto';
import { UpdateDeviceRequestTicketRequestDto } from '../dto/request/request-ticket/update-device-request-ticket.request.dto';

export interface DeviceRequestServiceInterface {
  list(request: ListDeviceRequestsRequestDto): Promise<any>;
  create(request: CreateDeviceRequestTicketRequestDto): Promise<any>;
  detail(id: string): Promise<any>;
  update(request: UpdateDeviceRequestTicketRequestDto): Promise<any>;
  delete(id: string): Promise<any>;
  updateStatus(request: UpdateStatusDeviceRequestRequestDto): Promise<any>;
  generateTicketCode(): Promise<string>;
}
