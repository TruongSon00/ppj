import { ListSerialByDeviceIds } from './../dto/request/list-device-assignment-by-device-ids.request.dto';
import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { DeviceAssignment } from 'src/models/device-assignment/device-assignment.model';
import { GetListDeviceAssignmentRequestDto } from '../dto/request/list-device-assignment.request.dto';
import { DeviceAssignRequestDto } from '../dto/request/device-assign.request.dto';
import { ExportDeviceAssignRequestDto } from '../dto/request/export-device-assign.dto';
import { Device } from 'src/models/device/device.model';
import { GetListDevicesRequestDto } from '@components/device/dto/request/list-devices.request.dto';
import { ListReportDeviceAssignStatusQuery } from '@components/report-device-status/dto/query/list-report-device-assign-status.query';
import { Types } from 'mongoose';
import { ListSerialByDeviceQuery } from '../dto/query/list-serial-by-device.query';
import { ListDeviceStatusQuery } from '@components/device-status/dto/query/list-device-status.query';
import { GetDashboardDeviceStatusRequestDto } from '@components/dashboard/dto/request/dashboard-device-status.request.dto';

export interface DeviceAssignmentRepositoryInterface
  extends BaseInterfaceRepository<DeviceAssignment> {
  dashboardDeviceAssignment(payload: any): Promise<any>;
  detailDeviceAssignment(id: string): Promise<any>;
  getDeviceAssignmentByDevice(deviceId: string): Promise<any>;
  getList(
    request: GetListDeviceAssignmentRequestDto,
    checkPermission: boolean,
  ): Promise<any>;
  createDocument(
    request: DeviceAssignRequestDto,
    device: Device,
    factoryId: number,
    userId: number,
    workCenterId: number,
    isMaintenanceTeam: boolean,
  ): DeviceAssignment;
  getDetailDeviceAssignment(
    id: string,
    checkPermission: boolean,
    userId: number,
  ): Promise<any>;
  insertMany(data: any[]): Promise<any>;
  getDeviceAssignPrint(serials: string[]): Promise<any>;
  exportList(
    request: ExportDeviceAssignRequestDto,
    checkPermission: boolean,
  ): Promise<any>;
  getDeviceAssignmentBySerial(serial: string): Promise<any>;
  getListForApp(
    request: GetListDevicesRequestDto,
    checkPermission: boolean,
  ): Promise<[any[], number]>;
  deviceAssignmentWithRelation(
    pageSize?: number,
    pageIndex?: number,
  ): Promise<any>;
  deviceAssignmentWithRelationByIds(ids: string[]): Promise<any[]>;
  countDocumentsByDeviceId(deviceId: string): Promise<number>;
  getDeviceAssignment(): Promise<any>;
  getDeviceAssignmentByIds(ids: string[]): Promise<any>;
  getListReportDeviceAssignStatus(
    request: ListReportDeviceAssignStatusQuery,
  ): Promise<{ result: any[]; count: number }>;
  getListSerialInUse(serial?: string): Promise<any>;
  findByIdsAndUpdate(ids: Types.ObjectId[], update: any): Promise<void>;
  listSerialByDevice(
    request: ListSerialByDeviceQuery,
  ): Promise<{ data: any; count: number }>;
  listSerialByDeviceIds(request: ListSerialByDeviceIds): Promise<any>;
  listDeviceStatus(request: ListDeviceStatusQuery): Promise<any>;
  findAllWithPopulate(condition: any, populate: any): Promise<any>;
  dashboardDevicestatus(
    request: GetDashboardDeviceStatusRequestDto,
  ): Promise<any[]>;
  countDocumentsByDeviceRequest(deviceRequestId: string): Promise<number>;
}
