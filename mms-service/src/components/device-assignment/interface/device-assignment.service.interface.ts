import { GetLogTimeByMoId } from '../dto/request/get-log-time-by-mo-id.dto';
import { ListSerialByDeviceIds } from './../dto/request/list-device-assignment-by-device-ids.request.dto';
import { ResponsePayload } from '@utils/response-payload';
import { GetListDeviceAssignmentRequestDto } from '../dto/request/list-device-assignment.request.dto';
import { DeviceAssignRequestDto } from '../dto/request/device-assign.request.dto';
import { UpdateDeviceAssignRequestDto } from '../dto/request/update-device-assign.request.dto';
import { GetDeviceAssignRequestDto } from '../dto/request/get-device-assign.request.dto';
import { ImportDeviceAssignRequestDto } from '../dto/request/import-device-assign.dto';
import { GenerateQrCodeSerialRequest } from '../dto/request/generate-qr-code-serial.request.dto';
import { ExportDeviceAssignRequestDto } from '../dto/request/export-device-assign.dto';
import { GenerateSerialRequest } from '../dto/request/generate-serial.request';
import { ValidateSerialRequest } from '../dto/request/validate-serial.request';
import { ListSerialRequest } from '../dto/request/list-serial.request.dto';
import { Types } from 'mongoose';
import { DeviceAssignment } from '../../../models/device-assignment/device-assignment.model';
import { Job } from '../../../models/job/job.model';
import { MaintainRequest } from '../../../models/maintain-request/maintain-request.model';
import { UpdateOperationTimeBySerial } from '../dto/request/update-operation-time-by-serial';
import { ListSerialByDeviceQuery } from '../dto/query/list-serial-by-device.query';
import { getMoList } from '../dto/request/get-mo-list.dto';
import { GetDeviceAssignmentByWorkCenterId } from '../dto/request/get-device-assignment-by-work-center.request.dto';

export interface DeviceAssignmentServiceInterface {
  getDetail(id: string): Promise<ResponsePayload<any>>;
  listDeviceAssignment(
    request: GetListDeviceAssignmentRequestDto,
  ): Promise<ResponsePayload<any>>;
  createAssignDevice(
    request: DeviceAssignRequestDto,
  ): Promise<ResponsePayload<any>>;
  updateAssignDevice(
    request: UpdateDeviceAssignRequestDto,
  ): Promise<ResponsePayload<any>>;
  getAssignDevice(
    request: GetDeviceAssignRequestDto,
  ): Promise<ResponsePayload<any>>;
  delete(request: GetDeviceAssignRequestDto): Promise<ResponsePayload<any>>;
  importAssignDevice(
    request: ImportDeviceAssignRequestDto,
  ): Promise<ResponsePayload<any>>;
  generateQrCodeSerial(
    request: GenerateQrCodeSerialRequest,
  ): Promise<ResponsePayload<any>>;
  exportAssignDevice(
    request: ExportDeviceAssignRequestDto,
  ): Promise<ResponsePayload<any>>;
  generateSerial(request: GenerateSerialRequest): Promise<ResponsePayload<any>>;
  validateSerial(request: ValidateSerialRequest): Promise<ResponsePayload<any>>;
  listSerial(request: ListSerialRequest): Promise<ResponsePayload<any>>;
  updateStatusByIds(
    ids: Types.ObjectId[],
    status: number,
  ): Promise<ResponsePayload<unknown>>;
  getByDeviceRequestTicketId(
    requestTicketId: Types.ObjectId,
  ): Promise<ResponsePayload<DeviceAssignment[]>>;
  calculateDeviceAssignmentIndexes(
    job: Job,
    deviceAssignment: DeviceAssignment,
    maintainRequest: MaintainRequest,
  ): any;
  updateDeviceAssignInfomation(deviceAssginment, maintainRequest): any;
  updateOperationTimeBySerial(
    request: UpdateOperationTimeBySerial,
  ): Promise<any>;
  listSerialByDevice(
    request: ListSerialByDeviceQuery,
  ): Promise<ResponsePayload<any>>;
  calcSupplyIndex(
    maintainRequest: MaintainRequest,
    deviceAssignment: DeviceAssignment,
    lastMaintainRequest: MaintainRequest,
    job: any,
  ): Promise<any>;
  listSerialByDeviceIds(request: ListSerialByDeviceIds): Promise<any>;
  getMoList(request: getMoList): Promise<any>;
  getLogTimeByMoId(payload: GetLogTimeByMoId): Promise<any>;
  getAttributeTypeByDeviceAssign(
    request: GetDeviceAssignRequestDto,
  ): Promise<ResponsePayload<any>>;
  getDeviceAssignmentByWorkCenterId(request: GetDeviceAssignmentByWorkCenterId);
}
