import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { Device } from '../../../models/device/device.model';
import { GetListDevicesRequestDto } from '@components/device/dto/request/list-devices.request.dto';
import { CreateDeviceRequestDto } from '@components/device/dto/request/create-device.request.dto';
import { FilterQuery, ObjectId, Types } from 'mongoose';
import { History } from '../../../models/history/history.model';
import { UpdateDeviceRequestDto } from '@components/device/dto/request/update-device.request.dto';
import { ListReportDeviceStatusQuery } from '@components/report-device-status/dto/query/list-report-device-status.query';

export interface DeviceRepositoryInterface
  extends BaseInterfaceRepository<Device> {
  getList(request: GetListDevicesRequestDto): Promise<any>;
  createDocument(request: CreateDeviceRequestDto): Device;
  detail(id: string): Promise<Device>;
  update(request: UpdateDeviceRequestDto, history: History): Promise<Device>;
  findOneByCode(code: string): Promise<any>;
  findOneBySerial(qrCode: Types.ObjectId): Promise<any>;
  confirm(id: string, history: History): Promise<string>;
  delete(id: string): Promise<Device>;
  detailApp(id: string): Promise<any>;
  findExistedByCondition(
    id: string,
    condition: FilterQuery<Device & { _id: any }>,
  );
  findOneById(id: string): Promise<Device>;
  findDeviceByIds(id: string[]): Promise<any>;
  getAll(): Promise<Device[]>;
  getDeviceBySupply(supplyId: string): Promise<any>;
  findMaintenanceTeam(id: string): Promise<any>;
  getListForApp(
    request: GetListDevicesRequestDto,
    checkPermission: boolean,
  ): Promise<any>;
  getListReportDeviceStatus(
    request: ListReportDeviceStatusQuery,
  ): Promise<{ result: any[]; count: number }>;
  getListDeviceByIds(ids: string[]): Promise<any>;
  findMaintenanceAttributeExist(id: string): Promise<any>;
  getListExport(request: GetListDevicesRequestDto): Promise<any[]>;
}
