import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { DeviceGroup } from '../../../models/device-group/device-group.model';
import { GetListDeviceGroupRequestDto } from '@components/device-group/dto/request/get-list-device-group.request.dto';

export interface DeviceGroupRepositoryInterface
  extends BaseInterfaceRepository<DeviceGroup> {
  getList(request: GetListDeviceGroupRequestDto): Promise<any>;
  createDocument(param: any): DeviceGroup;
  import(bulkOps: any): Promise<any>;
}
