import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { DeviceRequestTicket } from 'src/models/device-request-ticket/device-request-ticket.model';
import { CreateDeviceRequestTicketRequestDto } from '@components/device-request/dto/request/request-ticket/create-device-request-ticket.request.dto';
import { ListDeviceRequestsRequestDto } from '@components/device-request/dto/request/list-device-requests.request.dto';

export interface DeviceRequestTicketRepositoryInterface
  extends BaseInterfaceRepository<DeviceRequestTicket> {
  getList(
    request: ListDeviceRequestsRequestDto,
    isGetAll?: boolean,
  ): Promise<any>;
  createDocument(
    request: CreateDeviceRequestTicketRequestDto,
    code: string,
  ): DeviceRequestTicket;
  updateDocument(entity: DeviceRequestTicket, data: any): DeviceRequestTicket;
  getLatest(): Promise<DeviceRequestTicket>;
}
