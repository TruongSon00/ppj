import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { DeviceStatusModel } from '../../../models/device-status/device-status.model';
import { DeviceStatusActivityDetailRequestDto } from '../dto/request/create-device-status-activity.request.dto';
import { ListDeviceStatusActivityInfoRequestDto } from '../dto/request/list-device-status-activity-info.request.dto';

export interface DeviceStatusRepositoryInterface
  extends BaseInterfaceRepository<DeviceStatusModel> {
  listDeviceStatusActivityInfo(
    request: ListDeviceStatusActivityInfoRequestDto,
  ): Promise<any>;
  createDeviceStatusActivity(
    request: DeviceStatusActivityDetailRequestDto[],
    deviceAssignmentId: string,
  ): Promise<any>;
  findByDate(
    startDate: Date,
    endDate: Date,
    deviceAssignmentId: string,
  ): Promise<any>;
  createMany(data: any): Promise<any>;
}
