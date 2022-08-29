import { DEVICE_REQUEST_STATUS_ENUM } from '@components/device-request/device-request.constant';
import { SupplyTypeConstant } from '@components/supply/supply.constant';
import { ListSerialByDeviceIds } from './dto/request/list-device-assignment-by-device-ids.request.dto';
import { UserService } from '@components/user/user.service';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { MILISECOND_TO_MINUTE, HISTORY_ACTION } from '@constant/common';
import { DEPARTMENT_PERMISSION_SETTING_CAN_SEE } from '@utils/permissions/department-permission-setting';
import { ResponseBuilder } from '@utils/response-builder';
import {
  flatMap,
  isEmpty,
  isEqual,
  keyBy,
  last,
  flatten,
  groupBy,
  first,
  isNil,
} from 'lodash';
import { ApiError } from '@utils/api.error';
import { ResponsePayload } from '@utils/response-payload';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { GetListDeviceAssignmentRequestDto } from './dto/request/list-device-assignment.request.dto';
import { DeviceAssignRequestDto } from './dto/request/device-assign.request.dto';
import { DeviceAssignmentRepositoryInterface } from './interface/device-assignment.repository.interface';
import { DeviceAssignmentServiceInterface } from './interface/device-assignment.service.interface';
import { UpdateDeviceAssignRequestDto } from './dto/request/update-device-assign.request.dto';
import { DeviceRepositoryInterface } from '@components/device/interface/device.repository.interface';
import { GetDeviceAssignResponseDto } from './dto/response/get-device-assign.response.dto';
import { MaintainRequestRepositoryInterface } from '@components/maintain-request/interface/maintain-request.repository.interface';
import { HistoryActionEnum } from '@components/history/history.constant';
import { GetDeviceAssignRequestDto } from './dto/request/get-device-assign.request.dto';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { ImportDeviceAssignRequestDto } from './dto/request/import-device-assign.dto';
import { GenerateQrCodeSerialRequest } from './dto/request/generate-qr-code-serial.request.dto';
import { ExportDeviceAssignRequestDto } from './dto/request/export-device-assign.dto';
import { plainToInstance } from 'class-transformer';
import { ImportDeviceAssignResponseDto } from './dto/response/import-device-assignment.response.dto';
import { DeviceRequestTicketRepositoryInterface } from '@components/device-request/interface/device-request-ticket.repository.interface';
import { div, minus, plus } from '@utils/common';
import { ProduceService } from '@components/produce/produce.service';
import { Device } from 'src/models/device/device.model';
import * as moment from 'moment';
import { DeviceRequestTicket } from 'src/models/device-request-ticket/device-request-ticket.model';
import { DeviceRequestTicketStatus } from 'src/models/device-request-ticket/device-request-ticket.schema';
import { MAINTAIN_REQUEST_STATUS_ENUM } from '@components/maintain-request/maintain-request.constant';
import {
  JOB_TYPE_MAINTENANCE_ENUM,
  JOB_PRIORITY_ENUM,
  JOB_STATUS_ENUM,
  JOB_TYPE_ENUM,
} from '@components/job/job.constant';
import { DeviceAssignment } from 'src/models/device-assignment/device-assignment.model';
import { Job } from 'src/models/job/job.model';
import { MaintainRequest } from 'src/models/maintain-request/maintain-request.model';
import { GenerateSerialRequest } from './dto/request/generate-serial.request';
import { ValidateSerialRequest } from './dto/request/validate-serial.request';
import { MaintenanceTeamRepositoryInterface } from '@components/maintenance-team/interface/maintenance-team.repository.interface';
import {
  AssignTypeEnum,
  DeviceAssignStatus,
} from 'src/models/device-assignment/device-assignment.schema';
import { ListSerialRequest } from './dto/request/list-serial.request.dto';
import { Types } from 'mongoose';
import { UpdateOperationTimeBySerial } from './dto/request/update-operation-time-by-serial';
import { ListSerialByDeviceResponse } from './dto/response/list-serial-by-device.response';
import { ListSerialByDeviceQuery } from './dto/query/list-serial-by-device.query';
import { getMoList } from './dto/request/get-mo-list.dto';
import { GetMoList } from './dto/response/get-mo-list.response.dto';
import { GetLogTimeByMoIdResponse } from './dto/response/get-log-time-by-mo-id.response.dto';
import { GetLogTimeByMoId } from './dto/request/get-log-time-by-mo-id.dto';
import {
  DEVICE_ASIGNMENTS_STATUS_ENUM,
  WorkTimeDataSourceEnum,
} from './device-assignment.constant';
import { AttributeTypeRepositoryInterface } from '@components/attribute-type/interface/attribute-type.repository.interface';
import { DetailAttributeTypeResponse } from '@components/attribute-type/dto/response/detail-attribute-type.response';
import { GetDeviceAssignmentByWorkCenterId } from './dto/request/get-device-assignment-by-work-center.request.dto';
import { DetailDeviceAssignmentResponse } from './dto/response/detail-device-assignment.response.dto';
import { SupplyRepositoryInterface } from '@components/supply/interface/supply.repository.interface';
import { JobRepositoryInterface } from '@components/job/interface/job.repository.interface';
import { DeviceStatus, DeviceType } from '@components/device/device.constant';
import { UnitRepositoryInterface } from '@components/unit/interface/unit.repository.interface';

const MINUTES_IN_DAY = 1440;
@Injectable()
export class DeviceAssignmentService
  implements DeviceAssignmentServiceInterface
{
  constructor(
    @Inject('DeviceAssignmentRepositoryInterface')
    private readonly deviceAssignmentRepository: DeviceAssignmentRepositoryInterface,

    @Inject('DeviceRepositoryInterface')
    private readonly deviceRepository: DeviceRepositoryInterface,

    @Inject('DeviceRequestTicketRepositoryInterface')
    private readonly deviceRequestTicketRepository: DeviceRequestTicketRepositoryInterface,

    @Inject('MaintainRequestRepositoryInterface')
    private readonly maintainRequestRepository: MaintainRequestRepositoryInterface,

    @Inject('MaintenanceTeamRepositoryInterface')
    private readonly maintenanceTeamRepository: MaintenanceTeamRepositoryInterface,

    @Inject('AttributeTypeRepositoryInterface')
    private readonly attributeTypeRepository: AttributeTypeRepositoryInterface,

    @Inject('SupplyRepositoryInterface')
    private readonly supplyRepository: SupplyRepositoryInterface,

    @Inject('JobRepositoryInterface')
    private readonly jobRepository: JobRepositoryInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserService,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceService,

    @Inject('UnitRepositoryInterface')
    private readonly unitRepository: UnitRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async getDetail(id: string) {
    try {
      const deviceAssignment =
        await this.deviceAssignmentRepository.findOneById(id);
      return new ResponseBuilder(deviceAssignment)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      console.log(error);
    }
  }

  async listDeviceAssignment(
    request: GetListDeviceAssignmentRequestDto,
  ): Promise<any> {
    try {
      const checkPermission = await this.checkRuleItOrAdmin(request.user);
      const { result, count, pageIndex, pageSize } =
        await this.deviceAssignmentRepository.getList(request, checkPermission);
      const userIds = result.map((data) => data.deviceRequest[0]?.userId);
      const users = await this.userService.listUserByIds(userIds);
      const userItem = keyBy(users.data, 'id');
      const finalRes = result.map((element) => {
        const res = {
          ...element,
          user: element.deviceRequest[0]?.userId && {
            id: userItem[element.deviceRequest[0]?.userId]?.id,
            username: userItem[element.deviceRequest[0]?.userId]?.username,
            fullName: userItem[element.deviceRequest[0]?.userId]?.fullName,
          },
        };
        return res;
      });
      return new ResponseBuilder({
        result: finalRes,
        meta: { total: count, page: pageIndex, size: pageSize },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      console.log(error);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  async createAssignDevice(
    request: DeviceAssignRequestDto,
  ): Promise<ResponsePayload<any>> {
    let isMaintenanceTeam = false;
    const checkPermission = await this.checkRuleItOrAdmin(request.user);

    if (!checkPermission) {
      return new ApiError(
        ResponseCodeEnum.FORBIDDEN,
        await this.i18n.translate('error.FORBIDDEN'),
      ).toResponse();
    }
    const deviceRequest = await this.deviceRequestTicketRepository.findOneById(
      request.deviceRequestId,
    );

    if (isEmpty(deviceRequest)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.DEVICE_REQUEST_TICKET_NOT_FOUND'),
      ).toResponse();
    }

    if (
      deviceRequest.status !== DEVICE_REQUEST_STATUS_ENUM.WAITING_ASSIGNMENT
    ) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CANNOT_USING_DEVICE_REQUEST_TICKET'),
      ).toResponse();
    }

    const deviceAssignmentExists =
      await this.deviceAssignmentRepository.findOneByCondition({
        serial: request.serial,
      });

    if (deviceAssignmentExists) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.SERIAL_EXISTS'),
      ).toResponse();
    }

    // Check user exists
    const user = await this.userService.getUserById(
      Number(request.responsibleUserId) || 0,
    );
    if (isEmpty(user)) {
      try {
        const maintainanceTeam =
          await this.maintenanceTeamRepository.findOneById(
            request.responsibleUserId,
          );
        if (isEmpty(maintainanceTeam)) {
          return new ApiError(
            ResponseCodeEnum.NOT_FOUND,
            await this.i18n.translate('error.USER_NOT_FOUND'),
          ).toResponse();
        }
        isMaintenanceTeam = true;
      } catch (error) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.USER_NOT_FOUND'),
        ).toResponse();
      }
    }

    // Check device exists
    const device = await this.deviceRepository.findOneById(
      deviceRequest.deviceGroupIds.toString(),
    );
    if (
      device.type === DeviceType.ForManufacture &&
      !WorkTimeDataSourceEnum[request.workTimeDataSource]
    ) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.WORKTIME_DATA_SOURCE_REQUIRED'),
      ).toResponse();
    }
    if (
      device.type === DeviceType.ForManufacture &&
      isNil(request.productivityTarget)
    ) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.PRODUCTIVITY_TARGET_REQUIRED'),
      ).toResponse();
    }
    await this.validateDevice(device, request.oee, request.workTimeDataSource);

    // update status request device
    await this.updateStatusRequestDevice(deviceRequest);

    const workCenters = await this.produceService.getWorkCenters({
      isGetAll: '1',
    });

    const workCenterMap = new Map();
    workCenters.items.forEach((e) => {
      workCenterMap.set(e.id, e);
    });

    // const factoryId = workCenterMap.get(deviceRequest.workCenterId)?.factory.id;
    // const userId = deviceRequest.userId;

    const deviceAssignmentDocument =
      await this.deviceAssignmentRepository.createDocument(
        request,
        device,
        1,
        1,
        1,
        // deviceRequest.workCenterId,
        isMaintenanceTeam,
      );

    deviceAssignmentDocument.histories.push({
      userId: request.user.id,
      action: HistoryActionEnum.CREATE,
      createdAt: new Date(),
    });

    const deviceAssignment = await this.deviceAssignmentRepository.create(
      deviceAssignmentDocument,
    );

    await deviceAssignment.save();

    const messageCreatedJob = await this.i18n.translate('text.CREATED_JOB');

    await this.jobRepository.createJobEntity({
      jobTypeId: device.installTemplate,
      deviceAssignmentId: deviceAssignment._id,
      type: JOB_TYPE_ENUM.INSTALLATION,
      priority: JOB_PRIORITY_ENUM.TRIVIAL,
      histories: [
        {
          userId: request.user.id,
          action: HISTORY_ACTION.CREATED,
          content: `${request.user.username} ${messageCreatedJob}`,
          status: JOB_STATUS_ENUM.NON_ASSIGN,
        },
      ],
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async updateAssignDevice(
    request: UpdateDeviceAssignRequestDto,
  ): Promise<ResponsePayload<any>> {
    let isMaintenanceTeam = false;
    const checkPermission = await this.checkRuleItOrAdmin(request.user);

    if (!checkPermission) {
      return new ApiError(
        ResponseCodeEnum.FORBIDDEN,
        await this.i18n.translate('error.FORBIDDEN'),
      ).toResponse();
    }

    // Check device assignment exists
    const deviceAssignmentExists =
      await this.deviceAssignmentRepository.findOneByCondition({
        _id: request.id,
        deletedAt: null,
      });

    if (!deviceAssignmentExists) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.DEVICE_ASSIGNMENT_NOT_FOUND'),
      ).toResponse();
    }

    if (
      deviceAssignmentExists.status === DEVICE_ASIGNMENTS_STATUS_ENUM.RETURNED
    ) {
      deviceAssignmentExists.productivityTargetHistories.push({
        productivityTarget: deviceAssignmentExists.productivityTarget,
        createdAt: new Date(),
      });
    }

    const deviceRequest = await this.deviceRequestTicketRepository.findOneById(
      request.deviceRequestId,
    );

    if (isEmpty(deviceRequest)) {
      return new ApiError(
        ResponseCodeEnum.FORBIDDEN,
        await this.i18n.translate('error.DEVICE_REQUEST_TICKET_NOT_FOUND'),
      ).toResponse();
    }

    if (
      deviceAssignmentExists.deviceRequestId.toString() !==
      request.deviceRequestId.toString()
    ) {
      const oldDeviceRequest =
        await this.deviceRequestTicketRepository.findOneById(
          deviceAssignmentExists.deviceRequestId,
        );

      if (
        oldDeviceRequest.status === DEVICE_REQUEST_STATUS_ENUM.CONFIRMED &&
        deviceAssignmentExists.status === DeviceAssignStatus.Confirmed
      ) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.CANNOT_USING_DEVICE_REQUEST_TICKET'),
        ).toResponse();
      }
    }

    if (
      deviceRequest.status === DEVICE_REQUEST_STATUS_ENUM.CONFIRMED &&
      deviceAssignmentExists.status === DeviceAssignStatus.Confirmed
    ) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.NOT_ACCEPTABLE'),
      ).toResponse();
    }

    const deviceAssignmentSerialExists =
      await this.deviceAssignmentRepository.findOneByCondition({
        serial: request.serial,
        _id: {
          $ne: request.id,
        },
      });

    if (deviceAssignmentSerialExists) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.SERIAL_EXISTS'),
      ).toResponse();
    }

    // Check user exists
    const user = await this.userService.getUserById(
      Number(request.responsibleUserId) || 0,
    );
    if (isEmpty(user)) {
      try {
        const maintainanceTeam =
          await this.maintenanceTeamRepository.findOneById(
            request.responsibleUserId,
          );
        if (isEmpty(maintainanceTeam)) {
          return new ApiError(
            ResponseCodeEnum.NOT_FOUND,
            await this.i18n.translate('error.USER_NOT_FOUND'),
          ).toResponse();
        }
        isMaintenanceTeam = true;
      } catch (error) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.USER_NOT_FOUND'),
        ).toResponse();
      }
    }

    // Check device exists
    // const device = await this.deviceRepository.findOneById(
    //   deviceRequest.device.toString(),
    // );
    // if (
    //   device.type === DeviceType.ForManufacture &&
    //   !WorkTimeDataSourceEnum[request.workTimeDataSource]
    // ) {
    //   return new ApiError(
    //     ResponseCodeEnum.NOT_FOUND,
    //     await this.i18n.translate('error.WORKTIME_DATA_SOURCE_REQUIRED'),
    //   ).toResponse();
    // }
    // if (
    //   device.type === DeviceType.ForManufacture &&
    //   isNil(request.productivityTarget)
    // ) {
    //   return new ApiError(
    //     ResponseCodeEnum.NOT_FOUND,
    //     await this.i18n.translate('error.PRODUCTIVITY_TARGET_REQUIRED'),
    //   ).toResponse();
    // }
    // await this.validateDevice(device, request.oee, request.workTimeDataSource);

    // // update status request device
    // await this.updateStatusRequestDevice(
    //   deviceRequest,
    //   request,
    //   deviceAssignmentExists,
    // );

    // const workCenters = await this.produceService.getWorkCenters({
    //   isGetAll: '1',
    // });

    // const workCenterMap = new Map();
    // workCenters.items.forEach((e) => {
    //   workCenterMap.set(e.id, e);
    // });

    const factoryId = deviceRequest.factoryId;

    // Update device assignment
    for (const key in request) {
      if (key !== 'isReassign' && key !== 'responsibleUserId') {
        deviceAssignmentExists[key] = request[key];
      }
    }

    deviceAssignmentExists.assign.type = isMaintenanceTeam
      ? AssignTypeEnum.TEAM
      : AssignTypeEnum.USER;
    deviceAssignmentExists.assign.id = request.responsibleUserId;

    if (request.isReassign) {
      deviceAssignmentExists.status = DEVICE_ASIGNMENTS_STATUS_ENUM.UN_USE;
    }

    // deviceAssignmentExists.deviceId = deviceRequest.device.toString();
    deviceAssignmentExists.factoryId = factoryId;
    // deviceAssignmentExists.userId = deviceRequest.userId;
    // deviceAssignmentExists.workCenterId = deviceRequest.workCenterId;

    deviceAssignmentExists.histories.push({
      userId: request.user.id,
      action: HistoryActionEnum.UPDATE,
      createdAt: new Date(),
    });

    await deviceAssignmentExists.save();

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async getAssignDevice(
    request: GetDeviceAssignRequestDto,
  ): Promise<ResponsePayload<any>> {
    const checkPermission = await this.checkRuleItOrAdmin(request.user);

    // Get device assignment
    const deviceAssignment =
      await this.deviceAssignmentRepository.getDetailDeviceAssignment(
        request.id,
        checkPermission,
        request.user.id,
      );

    if (!deviceAssignment) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.DEVICE_ASSIGNMENT_NOT_FOUND'),
      ).toResponse();
    }

    let userHistories = deviceAssignment.histories.map((e) => e.userId);
    userHistories = userHistories.filter(
      (item, index) => userHistories.indexOf(item) === index,
    );
    let maintainanceTeam;
    const uIds = [deviceAssignment.deviceRequestId.userId, ...userHistories];
    if (deviceAssignment.assign.type === AssignTypeEnum.TEAM) {
      maintainanceTeam = await this.maintenanceTeamRepository.findOneById(
        deviceAssignment.assign.id,
      );
    } else {
      uIds.push(Number(deviceAssignment.assign.id));
    }

    const userList = await this.userService.getListByIDs(uIds);
    const users = new Map();
    userList.forEach((e) => {
      users.set(e.id, e);
    });

    const workCenter = await this.produceService.getDetailWorkCenter(
      deviceAssignment.deviceRequestId?.workCenterId,
    );

    const factory = await this.userService.getFactoryById(
      workCenter?.factory?.id,
    );

    // Map data to response
    const result: GetDeviceAssignResponseDto = new GetDeviceAssignResponseDto();
    result.id = deviceAssignment._id;
    result.requestId = deviceAssignment.deviceRequestId.id;
    result.requestCode = deviceAssignment.deviceRequestId.code;
    result.deviceCode = deviceAssignment.deviceRequestId.device.code;
    result.deviceId = deviceAssignment.deviceRequestId.device._id;
    result.deviceName = deviceAssignment.deviceRequestId.device.name;
    result.deviceType = deviceAssignment.deviceRequestId.device.type;
    result.serial = deviceAssignment.serial;
    result.model = deviceAssignment.deviceRequestId.device.model;
    result.assignedAt = deviceAssignment.assignedAt;
    result.usedAt = deviceAssignment.usedAt;
    result.status = deviceAssignment.status;
    result.oee = deviceAssignment.oee;
    result.workTimeDataSource = deviceAssignment?.workTimeDataSource;
    result.productivityTarget = deviceAssignment?.productivityTarget;
    result.factory = {
      id: factory?.id,
      code: factory?.code,
      name: factory?.name,
    };
    result.workCenter = {
      id: workCenter?.id,
      code: workCenter?.code,
      name: workCenter?.name,
    };
    result.histories = deviceAssignment.histories.map((e) => ({
      ...e,
      fullName: users.get(e.userId)?.fullName,
      userId: e.userId,
      username: users.get(e.userId)?.username,
      action: e.action,
      createdAt: e.createdAt,
    }));
    result.assignUser = {
      fullName: users.get(deviceAssignment.deviceRequestId.userId)?.fullName,
      userId: deviceAssignment.userId,
      username: users.get(deviceAssignment.deviceRequestId.userId)?.username,
    };
    result.responsibleUser = {
      fullName:
        users.get(Number(deviceAssignment.assign.id))?.fullName ||
        maintainanceTeam?.name,
      userId:
        +users.get(Number(deviceAssignment.assign.id))?.id ||
        maintainanceTeam?._id.toString(),
      username:
        users.get(Number(deviceAssignment.assign.id))?.username ||
        maintainanceTeam?.code,
    };

    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async delete(
    request: GetDeviceAssignRequestDto,
  ): Promise<ResponsePayload<any>> {
    const checkPermission = await this.checkRuleItOrAdmin(request.user);

    if (!checkPermission) {
      return new ApiError(
        ResponseCodeEnum.FORBIDDEN,
        await this.i18n.translate('error.FORBIDDEN'),
      ).toResponse();
    }

    const deviceAssignment = await this.deviceAssignmentRepository.findOneById(
      request.id,
    );

    if (!deviceAssignment) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.DEVICE_ASSIGNMENT_NOT_FOUND'),
      ).toResponse();
    }

    const deviceRequest = await this.deviceRequestTicketRepository.findOneById(
      deviceAssignment.deviceRequestId,
    );

    if (!deviceRequest) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.DEVICE_REQUEST_TICKET_NOT_FOUND'),
      ).toResponse();
    }

    if (deviceAssignment.status !== DEVICE_ASIGNMENTS_STATUS_ENUM.UN_USE) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.DEVICE_ASSIGNMENT_STATUS_INVALID'),
      ).toResponse();
    }
    const deletedAt = new Date();
    const job = await this.jobRepository.findOneByCondition({
      deviceAssignment: deviceAssignment._id.toString(),
    });

    if (job.type === JOB_TYPE_ENUM.INSTALLATION) {
      await this.jobRepository.findByIdAndUpdate(job._id.toString(), {
        deletedAt: deletedAt,
      });
    }

    deviceAssignment.deletedAt = deletedAt;
    deviceAssignment.histories.push({
      userId: request.user.id,
      action: HistoryActionEnum.DELETE,
      createdAt: new Date(),
    });
    deviceRequest.status = DEVICE_REQUEST_STATUS_ENUM.WAITING_ASSIGNMENT;
    await deviceRequest.save();
    await deviceAssignment.save();

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  private async checkRuleItOrAdmin(user: UserInforRequestDto): Promise<any> {
    const userDetail = await this.userService.getUserById(user.id);
    let checkPermission = false;
    userDetail.departmentSettings.forEach((department) => {
      if (DEPARTMENT_PERMISSION_SETTING_CAN_SEE.includes(department.id)) {
        checkPermission = true;
      }
    });

    return checkPermission;
  }

  async importAssignDevice(
    request: ImportDeviceAssignRequestDto,
  ): Promise<ResponsePayload<any>> {
    //check role
    const checkPermission = await this.checkRuleItOrAdmin(request.user);

    if (!checkPermission)
      return new ApiError(
        ResponseCodeEnum.FORBIDDEN,
        await this.i18n.translate('error.FORBIDDEN'),
      ).toResponse();

    const { items } = request;
    const res = new Array(items.length).fill(1);
    const successLine = [];
    const msgValidate = [];
    let item,
      deviceAssignmentExists,
      user,
      device,
      deviceRequest,
      deviceCheck,
      deviceAssign;
    const serialList = new Set();

    const deviceRequestList = new Map();

    const workCenters = await this.produceService.getWorkCenters({
      isGetAll: '1',
    });

    const workCenterMap = new Map();
    workCenters.items.forEach((e) => {
      workCenterMap.set(e.id, e);
    });
    //validate each item
    for (let index = 0; index < items.length; index++) {
      let isMaintenanceTeam = false;
      item = items[index];
      res[index] = 0;

      if (isEmpty(item.deviceRequestId)) {
        msgValidate.push(
          await this.i18n.translate('error.ID_DEVICE_REQUEST_TICKET_NOT_FOUND'),
        );
        continue;
      }

      //check device request exists
      deviceRequest = await this.deviceRequestTicketRepository.findOneById(
        item.deviceRequestId,
      );

      if (isEmpty(deviceRequest)) {
        msgValidate.push(
          await this.i18n.translate('error.DEVICE_REQUEST_TICKET_NOT_FOUND'),
        );
        continue;
      }

      if (deviceRequest.status === DeviceRequestTicketStatus.Assigned) {
        msgValidate.push(
          await this.i18n.translate('error.EXCEED_THE_REQUIRED_QUANTITY'),
        );
        continue;
      }

      if (
        deviceRequest.status !== DeviceRequestTicketStatus.AwaitingAssignment
      ) {
        msgValidate.push(
          await this.i18n.translate('error.CANNOT_USING_DEVICE_REQUEST_TICKET'),
        );
        continue;
      }

      //check serial exists
      deviceAssignmentExists =
        await this.deviceAssignmentRepository.findOneByCondition({
          serial: item.serial,
        });

      if (deviceAssignmentExists && !serialList.has(item.serial)) {
        msgValidate.push(await this.i18n.translate('error.SERIAL_EXISTS'));
        continue;
      }
      //check missing required field
      if (
        isEmpty(item.serial) ||
        isEmpty(item.usedAt) ||
        isEmpty(item.responsibleUserId)
      ) {
        msgValidate.push(
          await this.i18n.translate('error.MISSING_REQUIRED_FIELDS'),
        );
        continue;
      }

      //check responsible user exists
      user = await this.userService.getUserById(
        Number(item.responsibleUserId) || 0,
      );
      if (isEmpty(user)) {
        try {
          const maintainanceTeam =
            await this.maintenanceTeamRepository.findOneById(
              item.responsibleUserId,
            );
          if (isEmpty(maintainanceTeam)) {
            msgValidate.push(await this.i18n.translate('error.USER_NOT_FOUND'));
            continue;
          }
          isMaintenanceTeam = true;
        } catch (error) {
          msgValidate.push(await this.i18n.translate('error.USER_NOT_FOUND'));
          continue;
        }
      }
      //check device & oee exist
      device = await this.deviceRepository.findOneById(
        deviceRequest.device.toString(),
      );

      deviceCheck = this.validateDeviceItem(device, item.oee);

      if (deviceCheck) {
        msgValidate.push(deviceCheck);
        continue;
      }

      deviceAssign = await this.deviceAssignmentRepository.findAllByCondition({
        deviceRequestId: deviceRequest._id,
      });

      if (!deviceRequestList.has(deviceRequest._id)) {
        deviceRequestList.set(deviceRequest._id, 1);
      } else {
        const quantity = deviceRequestList.get(deviceRequest._id);
        deviceRequestList.set(deviceRequest._id, quantity);
      }

      if (
        minus(
          deviceRequest.quantity || 0,
          deviceRequestList.get(deviceRequest._id),
        ) === deviceAssign.length
      ) {
        // !Update status to success
        deviceRequest.status = 0;
        await deviceRequest.save();
      } else if (
        deviceRequest.quantity <
        plus(deviceAssign.length, deviceRequestList.get(deviceRequest._id))
      ) {
        msgValidate.push(
          await this.i18n.translate('error.EXCEED_THE_REQUIRED_QUANTITY'),
        );
        continue;
      }

      const factoryId = workCenterMap.get(deviceRequest.workCenterId)?.factory
        .id;
      const userId = deviceRequest.userId;

      res[index] = 1;
      successLine.push({
        ...item,
        device,
        factoryId,
        userId,
        deviceId: deviceRequest.device.toString(),
        workCenterId: deviceRequest.workCenterId,
        isMaintenanceTeam,
      });
      msgValidate.push('');
      serialList.add(item.serial);
    }

    //map data to response
    const input = successLine.map((item) => {
      const usedDate = moment(item.usedAt).startOf('day').toDate();
      //cacl maintainance date & replace date
      const estMaintenceDate = moment(usedDate)
        .add(device?.information?.maintenancePeriod || 0, 'm')
        .toDate();
      const estReplaceDate = moment(usedDate)
        .add(device?.information?.mttfIndex || 0, 'm')
        .toDate();
      const supplies = device?.information?.supplies?.map((e) => {
        return {
          supplyId: e.supplyId,
          estMaintenceDate: moment(usedDate)
            .add(e?.maintenancePeriod, 'm')
            .toDate(),
          estReplaceDate: moment(usedDate).add(e?.mttfIndex, 'm').toDate(),
        };
      });
      const history = [
        {
          userId: request.user.id,
          action: HistoryActionEnum.CREATE,
          createdAt: new Date(),
        },
      ];
      const information = {
        estMaintenceDate,
        estReplaceDate,
        supplies,
        mttrIndex: device?.information?.mttrIndex || 0,
        mttaIndex: device?.information?.mttaIndex || 0,
        mttfIndex: device?.information?.mttfIndex || 0,
        mtbfIndex: device?.information?.mtbfIndex || 0,
      };
      return {
        serial: item.serial,
        assignedAt: item.assignedAt,
        usedAt: item.usedAt,
        deviceRequestId: item.deviceRequestId,
        deviceId: item.deviceId,
        oee: item.oee,
        factoryId: item.factoryId,
        userId: item.userId,
        workCenterId: item.workCenterId,
        assign: {
          type: item.isMaintenanceTeam
            ? AssignTypeEnum.TEAM
            : AssignTypeEnum.USER,
          id: item.responsibleUserId,
        },
        status: DEVICE_ASIGNMENTS_STATUS_ENUM.UN_USE,
        information,
        history,
      };
    });
    const errFlg = false;

    //insert data
    await this.deviceAssignmentRepository.insertMany(input);

    if (errFlg)
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();

    if (successLine.length == items.length)
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();

    const response = plainToInstance(
      ImportDeviceAssignResponseDto,
      {
        SUCCESS: successLine.length,
        FAIL: items.length - successLine.length,
        statusImport: res,
        messageValidate: msgValidate,
      },
      {
        excludeExtraneousValues: true,
      },
    );
    if (successLine.length == 0)
      return new ResponseBuilder(response)
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async generateQrCodeSerial(
    request: GenerateQrCodeSerialRequest,
  ): Promise<ResponsePayload<any>> {
    const assignDeviceSerials = request.serials.map((serial) => serial.serial);

    const assignDevice =
      await this.deviceAssignmentRepository.getDeviceAssignPrint(
        assignDeviceSerials,
      );

    if (!assignDevice.length) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const userIds = assignDevice.map((e) => e.deviceRequestId.userId) || [];

    const users = await this.userService.getListByIDs(userIds);
    const userMap = new Map();
    users.forEach((e) => {
      userMap.set(e.id, e);
    });

    const workCenters = await this.produceService.getWorkCenters({
      isGetAll: '1',
    });

    const workCenterMap = new Map();
    workCenters.items.forEach((e) => {
      workCenterMap.set(e.id, e);
    });

    const quantityBySerial = new Map();
    request.serials.forEach((e) => {
      quantityBySerial.set(e.serial, e.quantity);
    });

    let responseString = '';
    const foY = 0;
    const foX = 230;
    const num = 10;
    const fbMaxWidth = 450;
    const fbMaxLine = 10;
    const start_command_chars = '^XA';
    const end_command_chars = '^XZ';

    assignDevice.forEach((e) => {
      const quantityQrCode = quantityBySerial.get(e.serial) || 0;

      for (let i = 0; i < quantityQrCode; i++) {
        let str =
          `${start_command_chars}
          ^FX--title--^FS
          ^CFZN,0,45
          ^CI28
          ^LH180,40^FS
          ^A@N,50,40,E:SOURCESANSPRO-BO.TTF
          ^FDPHÂN CÔNG THIẾT BỊ^FS` +
          `^FX--QRCode--^FS
          ^LH10,130^FS
          ^BQR,2,9^FDLA
          ^FDQA,${e.serial}^FS` +
          `^FX--Nội dung--^FS
          ^CI28
          ^FO${foX},${foY + num * 0}
          ^A@N,25,25,E:SOURCESANSPRO-RE.TTF
          ^FB${fbMaxWidth},${fbMaxLine},0,L,0
          ^TBN,440,300
          ^FDSerial: ${e.serial.replace(/_/g, '_5F')}^FS
          ^FO${foX},${foY + num * 3}
          ^A@N,25,25,E:SOURCESANSPRO-RE.TTF
          ^FB${fbMaxWidth},${fbMaxLine},0,L,0
          ^TBN,440,300
          ^FD`;

        let strTemp = `Tên thiết bị: ${e.deviceId.name}`;
        strTemp = this.validateLine(strTemp, 105);

        let line = Math.ceil(strTemp.length / 40);
        let lineOdd = strTemp.length % 40;
        if (lineOdd === 0) {
          line++;
        }

        const factory = workCenterMap.get(e.deviceRequestId.workCenterId)
          ?.factory.name;
        const strTemp1 = strTemp;

        if (factory !== undefined) {
          strTemp += `^FS
            ^FO${foX},${foY + num * 3 * (line + 1) + line}
            ^A@N,25,25,E:SOURCESANSPRO-RE.TTF
            ^FB${fbMaxWidth},${fbMaxLine},0,L,0
            ^TBN,440,300
            ^FD`;
          let strTemp1 = `Nhà máy: ${factory}`;
          strTemp1 = this.validateLine(strTemp1, 90);

          strTemp += strTemp1;
          strTemp1 += strTemp1;
        }

        line = Math.ceil(strTemp1.length / 40);
        lineOdd = strTemp1.length % 40;
        if (lineOdd === 0) {
          line++;
        }

        strTemp += `^FS
          ^FO${foX},${foY + num * 3 * (line + 1) + line}
          ^A@N,25,25,E:SOURCESANSPRO-RE.TTF
          ^FB${fbMaxWidth},${fbMaxLine},0,L,0
          ^TBN,440,300
          ^FD`;
        let strTemp2 = `Đối tượng sử dụng: ${
          userMap.get(e.deviceRequestId.userId)?.fullName
        }`;
        strTemp2 = this.validateLine(strTemp2, 90);

        strTemp += strTemp2 + '^FS';
        str += strTemp;
        responseString += str + end_command_chars;
      }
    });

    return new ResponseBuilder(responseString)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  private validateLine(str: string, num: number): string {
    let result = '';

    let count = 0;
    const arr = str.split('');
    for (let i = 0; i < arr.length; i++) {
      result += arr[i];
      count++;
      if (count == num) {
        result += `...`;
        break;
      }
    }

    return result;
  }

  async exportAssignDevice(
    request: ExportDeviceAssignRequestDto,
  ): Promise<ResponsePayload<any>> {
    try {
      const checkPermission = await this.checkRuleItOrAdmin(request.user);
      const { result, count } =
        await this.deviceAssignmentRepository.exportList(
          request,
          checkPermission,
        );
      const { filter, sort } = request;
      const order = null;
      const userIds = result.map((data) => data.deviceRequest[0]?.userId);
      const workCenterIds = result.map(
        (data) => data.deviceRequest[0]?.workCenterId,
      );
      const responsibleUserIds = result.map((data) => data.assign?.id);
      const users = await this.userService.listUserByIds(userIds);
      const responsibleUsers = await this.userService.listUserByIds(
        responsibleUserIds,
      );
      const workCenters = [];
      let workCenter;
      for (let i = 0; i < workCenterIds.length; i++) {
        if (workCenterIds[i]) {
          workCenter = await this.produceService.getDetailWorkCenter(
            workCenterIds[i],
          );
          workCenters.push(workCenter?.name || '');
        } else {
          workCenters.push('');
        }
      }
      const userItem = keyBy(users.data, 'id');
      const responsibleUserItem = keyBy(responsibleUsers.data, 'id');
      let finalRes = result.map((resp, index) => {
        return {
          assignedAt: resp?.assignedAt,
          usedAt: resp?.usedAt,
          serial: resp?.serial,
          requestCode: resp.deviceRequest[0]?.code,
          code: resp.deviceRequest[0]?.device[0]?.code,
          name: resp.deviceRequest[0]?.device[0]?.name,
          model: resp.deviceRequest[0]?.device[0]?.model,
          workCenter: workCenters[index],
          mttrIndex: resp.deviceRequest[0]?.device[0]?.information?.mttrIndex,
          mttaIndex: resp.deviceRequest[0]?.device[0]?.information?.mttaIndex,
          mttfIndex: resp.deviceRequest[0]?.device[0]?.information?.mttfIndex,
          mtbfIndex: resp.deviceRequest[0]?.device[0]?.information?.mtbfIndex,
          maintenancePeriod:
            resp.deviceRequest[0]?.device[0]?.information?.maintenancePeriod,
          maintenanceDate:
            resp.deviceRequest[0]?.device[0]?.information?.estMaintenceDate,
          replaceDate:
            resp.deviceRequest[0]?.device[0]?.information?.estReplaceDate,
          assignUser: userItem[resp.deviceRequest[0]?.userId]?.fullName,
          responsibleUser: responsibleUserItem[resp.assign?.id]?.fullName,
        };
      });
      if (!isEmpty(filter)) {
        filter.forEach((item) => {
          if (isEqual(item.column, 'assignUser')) {
            finalRes = finalRes.filter(
              (e) =>
                e.assignUser &&
                e.assignUser
                  .toLowerCase()
                  .match(('.*' + (item.text || '') + '.*').toLowerCase()),
            );
          } else if (isEqual(item.column, 'responsibleUser')) {
            finalRes = finalRes.filter(
              (e) =>
                e.responsibleUser &&
                e.responsibleUser
                  .toLowerCase()
                  .match(('.*' + (item.text || '') + '.*').toLowerCase()),
            );
          } else if (isEqual(item.column, 'workCenter')) {
            finalRes = finalRes.filter(
              (e) =>
                e.workCenter &&
                e.workCenter
                  .toLowerCase()
                  .match(('.*' + (item.text || '') + '.*').toLowerCase()),
            );
          }
        });
      }

      if (!isEmpty(sort)) {
        sort.forEach((item) => {
          if (isEqual(item.column, 'assignUser')) {
            if (isEqual(item.order, 'DESC'))
              finalRes.sort((a, b) => {
                if (a.assignUser)
                  return a.assignUser.localeCompare(b.assignUser);
                else return 1;
              });
            else
              finalRes.sort((a, b) => {
                if (b.assignUser)
                  return b.assignUser.localeCompare(a.assignUser);
                else return -1;
              });
          } else if (isEqual(item.column, 'responsibleUser')) {
            if (isEqual(item.order, 'DESC'))
              finalRes.sort((a, b) => {
                if (a.responsibleUser)
                  return a.responsibleUser.localeCompare(b.responsibleUser);
                else return 1;
              });
            else
              finalRes.sort((a, b) => {
                if (b.assignUser)
                  return b.responsibleUser.localeCompare(a.responsibleUser);
                else return -1;
              });
          } else if (isEqual(item.column, 'workCenter')) {
            if (isEqual(item.order, 'DESC'))
              finalRes.sort((a, b) => {
                if (a.workCenter)
                  return a.workCenter.localeCompare(b.workCenter);
                else return 1;
              });
            else
              finalRes.sort((a, b) => {
                if (b.workCenter)
                  return b.workCenter.localeCompare(a.workCenter);
                else return -1;
              });
          }
        });
      }
      return new ResponseBuilder({ result: finalRes, count: finalRes.length })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      console.log(error);
    }
  }

  private async updateStatusRequestDevice(
    deviceRequest: DeviceRequestTicket,
    request?: UpdateDeviceAssignRequestDto | DeviceAssignRequestDto,
    deviceAssignmentExists?: DeviceAssignment,
  ): Promise<any> {
    const deviceAssign =
      await this.deviceAssignmentRepository.findAllByCondition({
        deviceRequestId: deviceRequest._id,
      });

    // Update status device request ticket to confirmed
    if (minus(deviceRequest.quantity || 0, 1) === deviceAssign.length) {
      deviceRequest.status = DEVICE_REQUEST_STATUS_ENUM.CONFIRMED;
      await deviceRequest.save();
    }

    // Check if new device request different old device request
    if (
      !isEmpty(request) &&
      !isEmpty(deviceAssignmentExists) &&
      request.deviceRequestId.toString() !==
        deviceAssignmentExists.deviceRequestId.toString()
    ) {
      const oldDeviceRequest =
        await this.deviceRequestTicketRepository.findOneById(
          deviceAssignmentExists.deviceRequestId,
        );

      // Check if old device request confirmed then update status to waiting assign
      if (oldDeviceRequest.status === DEVICE_REQUEST_STATUS_ENUM.CONFIRMED) {
        oldDeviceRequest.status = DEVICE_REQUEST_STATUS_ENUM.WAITING_ASSIGNMENT;
        await oldDeviceRequest.save();
      }
    }
  }

  private async validateDevice(
    device: Device,
    oee: number,
    workTimeDataSource: number,
  ): Promise<any> {
    if (!device) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.DEVICE_NOT_FOUND'),
      ).toResponse();
    }

    if (device.status === DeviceStatus.AwaitingConfirmation) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.DEVICE_NOT_CONFIRM'),
      ).toResponse();
    }

    // Check type device is normal or formanufacure
    // type = normal => factoryId, oee = null
    if (device.type === DeviceType.ForManufacture) {
      if (oee === undefined || oee === null)
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.OEE_NOT_EMPTY'),
        ).toResponse();
      if (workTimeDataSource === undefined || workTimeDataSource === null)
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.WORK_TIME_DATA_SOURCE_NOT_EMPTY'),
        ).toResponse();
    }
  }

  private async validateDeviceItem(device: Device, oee: number): Promise<any> {
    if (!device) return await this.i18n.translate('error.DEVICE_NOT_FOUND');

    if (device.status === DeviceStatus.AwaitingConfirmation) {
      return await this.i18n.translate('error.DEVICE_NOT_CONFIRMED');
    }

    // Check type device is normal or formanufacure
    // type = normal => factoryId, oee = null
    if (device.type === DeviceType.ForManufacture && isEmpty(oee)) {
      return await this.i18n.translate('error.OEE_NOT_EMPTY');
    }
    return null;
  }

  async generateSerial(
    request: GenerateSerialRequest,
  ): Promise<ResponsePayload<any>> {
    const device = await this.deviceRepository.findOneByCode(
      request.deviceCode,
    );

    if (isEmpty(device)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.DEVICE_NOT_FOUND'),
      ).toResponse();
    }

    let countDeviceAssign =
      await this.deviceAssignmentRepository.countDocumentsByDeviceId(
        device._id,
      );

    let serial = `${request.deviceCode}${plus(countDeviceAssign || 0, 1001)
      .toString()
      .slice(1)}`;
    let check = true;

    do {
      const deviceAssignExist =
        await this.deviceAssignmentRepository.findOneByCondition({
          serial,
        });
      if (isEmpty(deviceAssignExist)) {
        check = false;
      } else {
        serial = `${request.deviceCode}${plus(countDeviceAssign++, 1001)
          .toString()
          .slice(1)}`;
      }

      if (countDeviceAssign >= 1000) {
        check = false;
        serial = '';
      }
    } while (check);

    return new ResponseBuilder({
      serial,
      responsibleUserId: device.responsibleUserId,
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async validateSerial(
    request: ValidateSerialRequest,
  ): Promise<ResponsePayload<any>> {
    const deviceAssignExist =
      await this.deviceAssignmentRepository.findOneByCondition({
        serial: request.serial,
      });

    let status = true;

    if (!isEmpty(deviceAssignExist)) {
      status = false;
    }

    return new ResponseBuilder({
      status,
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async listSerial(request: ListSerialRequest): Promise<ResponsePayload<any>> {
    try {
      const { result, count } =
        await this.deviceAssignmentRepository.getListSerialInUse(
          request.serial,
        );

      const userIds = result.map((data) => data.deviceRequest[0]?.userId);
      const users = await this.userService.listUserByIds(userIds);
      const userItem = keyBy(users.data, 'id');
      const finalRes = result.map((element) => {
        const res = {
          ...element,
          user: element.deviceRequest[0]?.userId && {
            id: userItem[element.deviceRequest[0]?.userId]?.id,
            fullName: userItem[element.deviceRequest[0]?.userId]?.fullName,
            username: userItem[element.deviceRequest[0]?.userId]?.username,
          },
        };
        return res;
      });

      return new ResponseBuilder({
        result: finalRes,
        count,
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.BAD_REQUEST'),
      ).toResponse();
    }
  }

  async updateStatusByIds(
    ids: Types.ObjectId[],
    status: number,
  ): Promise<ResponsePayload<unknown>> {
    await this.deviceAssignmentRepository.findByIdsAndUpdate(ids, {
      status: status,
    });

    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
  }

  async getByDeviceRequestTicketId(
    requestTicketId: Types.ObjectId,
  ): Promise<ResponsePayload<DeviceAssignment[]>> {
    const deviceAssignment =
      await this.deviceAssignmentRepository.findAllByCondition({
        deviceRequestId: requestTicketId,
      });

    if (!deviceAssignment)
      return new ResponseBuilder<DeviceAssignment[]>()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.DEVICE_ASSIGNMENT_NOT_FOUND'),
        )
        .build();

    return new ResponseBuilder<DeviceAssignment[]>()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(deviceAssignment)
      .build();
  }

  async calculateDeviceAssignmentIndexes(
    job: Job,
    deviceAssignment: DeviceAssignment,
    maintainRequest: MaintainRequest,
  ) {
    let usedTimeUntilMaintenance = null;
    let usedTimeUntilReplace = null;
    let errorConfirmationTime = null;
    let maintenanceExecutionTime = null;
    const { maintainRequestHistories = [] } = deviceAssignment;
    // thời gian bắt đầu sử dụng
    let usedAt = deviceAssignment.usedAt.getTime() / MILISECOND_TO_MINUTE;
    if (
      maintainRequestHistories.length > 0 &&
      job.result.maintenanceType === JOB_TYPE_MAINTENANCE_ENUM.MAINTENANCE
    ) {
      // id lần bảo trì gần nhất
      const lastMaintainRequestId =
        maintainRequestHistories[maintainRequestHistories.length - 1]
          .maintainRequestId;
      const lastMaintainRequest =
        await this.maintainRequestRepository.findOneById(lastMaintainRequestId);

      // thời gian bắt đầu bảo trì = thời gian thực thi xong yêu cầu bảo trì gần nhất
      usedAt =
        lastMaintainRequest.histories
          .find(
            (history) =>
              history.status === MAINTAIN_REQUEST_STATUS_ENUM.EXECUTED,
          )
          ?.createdAt.getTime() / MILISECOND_TO_MINUTE;
    }

    // thời gian tạo yêu cầu bảo trì mới
    const timeCreateNewMaintainRequest =
      maintainRequest.createdAt.getTime() / MILISECOND_TO_MINUTE;

    //thời gian thực thi yêu cầu bảo trì mới
    const timeExecutedMaintainRequest =
      maintainRequest.histories
        .find(
          (history) => history.status === MAINTAIN_REQUEST_STATUS_ENUM.EXECUTED,
        )
        ?.createdAt.getTime() / MILISECOND_TO_MINUTE;

    // thời gian IT xác nhận yêu cầu bảo trì mới
    const timeITConfirmed =
      maintainRequest.histories
        .find(
          (history) =>
            history.status === MAINTAIN_REQUEST_STATUS_ENUM.CONFIRMED_2,
        )
        ?.createdAt.getTime() / MILISECOND_TO_MINUTE;
    if (job.result.maintenanceType === JOB_TYPE_MAINTENANCE_ENUM.MAINTENANCE) {
      // calc used time when maintenance
      usedTimeUntilMaintenance = timeCreateNewMaintainRequest - usedAt;
    }

    // calc usage time when replace
    if (job.result.maintenanceType === JOB_TYPE_MAINTENANCE_ENUM.REPLACE) {
      usedTimeUntilReplace = timeCreateNewMaintainRequest - usedAt;
    }

    // calc error confirmation time
    errorConfirmationTime = timeITConfirmed - timeCreateNewMaintainRequest;

    // calc maintenanceExecutionTime
    maintenanceExecutionTime = timeExecutedMaintainRequest - timeITConfirmed;

    return {
      usedTimeUntilMaintenance,
      usedTimeUntilReplace,
      errorConfirmationTime,
      maintenanceExecutionTime,
    };
  }

  async updateDeviceAssignInfomation(deviceAssignment, maintainRequest) {
    const device = await this.deviceRepository.findOneById(
      deviceAssignment.deviceId,
    );
    const usedDate =
      maintainRequest.histories.find(
        (history) => history.status === MAINTAIN_REQUEST_STATUS_ENUM.EXECUTED,
      )?.createdAt || deviceAssignment.usedAt;

    //calc maintainance date & replace date
    const estMaintenceDate = moment(usedDate)
      .add(device?.information?.maintenancePeriod || 0, 'm')
      .toDate();
    const estReplaceDate = moment(usedDate)
      .add(device?.information?.mttfIndex || 0, 'm')
      .toDate();
    const supplies = device?.information?.supplies?.map((e) => {
      return {
        supplyId: e.supplyId,
        estMaintenceDate: moment(usedDate)
          .add(e?.maintenancePeriod, 'm')
          .toDate(),
        estReplaceDate: moment(usedDate).add(e?.mttfIndex, 'm').toDate(),
      };
    });

    return {
      ...deviceAssignment.information,
      estMaintenceDate,
      estReplaceDate,
      supplies,
    };
  }

  async updateOperationTimeBySerial(request: UpdateOperationTimeBySerial) {
    const { serial, workOrderId } = request;
    const deviceAssignment =
      await this.deviceAssignmentRepository.findOneByCondition({ serial });
    if (!deviceAssignment) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.DEVICE_ASSIGNMENT_NOT_FOUND'),
      );
    }
    const workOrder = await this.produceService.getDetailWorkOrder(workOrderId);
    if (!workOrder) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.WORK_ORDER_INVALID'),
      );
    }
    try {
      await this.deviceAssignmentRepository.findByIdAndUpdate(
        deviceAssignment._id.toString(),
        {
          $push: {
            operationTime: request,
          },
        },
      );
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      return new ApiError(
        ResponseCodeEnum.INTERNAL_SERVER_ERROR,
        await this.i18n.translate('error.INTERNAL_SERVER_ERROR'),
      );
    }
  }

  async listSerialByDevice(
    request: ListSerialByDeviceQuery,
  ): Promise<ResponsePayload<any>> {
    const { data, count } =
      await this.deviceAssignmentRepository.listSerialByDevice(request);

    const dataReturn = plainToInstance(ListSerialByDeviceResponse, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder({
      result: dataReturn,
      meta: { total: count, page: request.page, size: request.limit },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async calcSupplyIndex(
    maintainRequest,
    deviceAssginment,
    lastMaintainRequest,
    job,
  ) {
    if (isEmpty(job.actualSupplies)) {
      return [];
    }
    const supplyIds = flatMap(job.actualSupplies, 'supplyId');
    const supplies = await this.supplyRepository.findAllByCondition({
      _id: { $in: supplyIds },
    });
    const supplyList = keyBy(supplies, '_id');
    const { maintainRequestHistories = [] } = deviceAssginment;
    const supplyMaintained = flatMap(
      maintainRequestHistories,
      'supplyHistories',
    );

    const suppliesHistory = [];
    const sumOfField = (items, props, initValue) => {
      return items.reduce((pre, cur) => {
        return !cur[props] ? pre : +pre + +cur[props];
      }, initValue);
    };
    job.actualSupplies.forEach((supply) => {
      if (supplyList[supply.supplyId].type === SupplyTypeConstant.ACCESSORY) {
        const supplyIndex = {
          supplyId: supply.supplyId,
          usageTimeToMaintenance: null,
          usageTimeToReplace: null,
          confirmationTime: null,
          repairTime: null,
          mttfIndex: null,
          mtbfIndex: null,
          mttaIndex: null,
          mttrIndex: null,
          maintenanceType: null,
          estReplaceDate: null,
          estMaintenceDate: null,
        };
        const currentSupply = deviceAssginment?.supplyIndex?.find(
          (e) => e.supplyId.toString() === supply.supplyId.toString(),
        );
        // số lần thay thế của phụ tùng
        const supplyReplaceHistories = supplyMaintained.filter(
          (sup) =>
            sup.supplyId.toString() === supply.supplyId.toString() &&
            sup.maintenanceType === JOB_TYPE_MAINTENANCE_ENUM.REPLACE,
        );

        // số lần bảo trì của phụ tùng
        const supplyMaintenanceHistories = supplyMaintained.filter(
          (sup) =>
            sup.supplyId.toString() === supply.supplyId.toString() &&
            sup.maintenanceType === JOB_TYPE_MAINTENANCE_ENUM.MAINTENANCE,
        );

        // số lần thay thế & bảo trì của phụ tùng
        const supplyHistories = [
          ...supplyMaintenanceHistories,
          ...supplyReplaceHistories,
        ];

        //thời gian chờ xác nhận lỗi
        const timeITConfirmed =
          maintainRequest.histories
            .find(
              (history) =>
                history.status === MAINTAIN_REQUEST_STATUS_ENUM.CONFIRMED_2,
            )
            ?.createdAt?.getTime() / MILISECOND_TO_MINUTE;

        // thời gian sửa lỗi
        const timeExecutedMaintainRequest =
          maintainRequest.histories
            .find(
              (history) =>
                history.status === MAINTAIN_REQUEST_STATUS_ENUM.EXECUTED,
            )
            ?.createdAt?.getTime() / MILISECOND_TO_MINUTE;

        // thời gian tạo yêu cầu bảo trì
        const timeCreateNewestMaintainRequest =
          maintainRequest.createdAt?.getTime() / MILISECOND_TO_MINUTE;

        // thời gian bắt đầu sử dụng
        let timeStartUse =
          deviceAssginment?.usedAt?.getTime() / MILISECOND_TO_MINUTE;
        if (
          !isEmpty(maintainRequestHistories) &&
          lastMaintainRequest &&
          supply.maintenanceType === JOB_TYPE_MAINTENANCE_ENUM.MAINTENANCE
        ) {
          // thời gian bắt đầu bảo trì = thời gian thực thi xong yêu cầu bảo trì gần nhất
          timeStartUse =
            lastMaintainRequest.histories
              .find(
                (history) =>
                  history.status === MAINTAIN_REQUEST_STATUS_ENUM.EXECUTED,
              )
              ?.createdAt.getTime() / MILISECOND_TO_MINUTE;
        }
        if (
          !isEmpty(supplyReplaceHistories) &&
          supply.maintenanceType === JOB_TYPE_MAINTENANCE_ENUM.REPLACE
        ) {
          timeStartUse =
            last(supplyReplaceHistories)?.createdAt?.getTime() /
            MILISECOND_TO_MINUTE;
        }

        // thời gian xác nhận lỗi
        supplyIndex.confirmationTime =
          timeITConfirmed - timeCreateNewestMaintainRequest;
        const totalConfirmationTime = sumOfField(
          supplyHistories,
          'confirmationTime',
          supplyIndex.confirmationTime,
        );
        supplyIndex.mttaIndex =
          totalConfirmationTime / (supplyHistories.length + 1);

        // thời gian sửa lỗi
        supplyIndex.repairTime = timeExecutedMaintainRequest - timeITConfirmed;
        const totalRepairTime = sumOfField(
          supplyHistories,
          'repairTime',
          supplyIndex.repairTime,
        );
        supplyIndex.mttrIndex = totalRepairTime / (supplyHistories.length + 1);
        // trường hợp phụ tùng là thay thế
        if (supply.maintenanceType === JOB_TYPE_MAINTENANCE_ENUM.REPLACE) {
          supplyIndex.maintenanceType = JOB_TYPE_MAINTENANCE_ENUM.REPLACE;
          //thời gian sử dụng đến khi thay thế
          supplyIndex.usageTimeToReplace =
            timeCreateNewestMaintainRequest - timeStartUse;
          const totalUsageTimeToReplace = sumOfField(
            supplyReplaceHistories,
            'usageTimeToMaintenance',
            supplyIndex.usageTimeToReplace,
          );
          supplyIndex.mttfIndex =
            totalUsageTimeToReplace / (supplyReplaceHistories.length + 1);
          supplyIndex.estReplaceDate = moment(
            timeStartUse * MILISECOND_TO_MINUTE,
          )
            .add(supplyIndex.mttfIndex, 'm')
            .toDate();
          supplyIndex.mtbfIndex = currentSupply.mtbfIndex;
        }

        // trường hợp phụ tùng là bảo trì
        if (supply.maintenanceType === JOB_TYPE_MAINTENANCE_ENUM.MAINTENANCE) {
          supplyIndex.maintenanceType = JOB_TYPE_MAINTENANCE_ENUM.MAINTENANCE;
          // thời gian sử dụng đến khi bảo dưỡng
          supplyIndex.usageTimeToMaintenance =
            timeCreateNewestMaintainRequest - timeStartUse;
          const totalUsageTimeToMaintenance = sumOfField(
            supplyReplaceHistories,
            'usageTimeToMaintenance',
            supplyIndex.usageTimeToMaintenance,
          );
          supplyIndex.mtbfIndex =
            totalUsageTimeToMaintenance /
            (supplyMaintenanceHistories.length + 1);
          supplyIndex.estMaintenceDate = moment(
            timeStartUse * MILISECOND_TO_MINUTE,
          )
            .add(supplyIndex.mtbfIndex, 'm')
            .toDate();
          supplyIndex.mttfIndex = currentSupply?.mttfIndex;
        }
        suppliesHistory.push(supplyIndex);
      }
    });
    return suppliesHistory;
  }

  async listSerialByDeviceIds(
    request: ListSerialByDeviceIds,
  ): Promise<ResponsePayload<any>> {
    const data = await this.deviceAssignmentRepository.listSerialByDeviceIds(
      request,
    );

    const dataReturn = plainToInstance(ListSerialByDeviceResponse, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async getMoList(request: getMoList): Promise<any> {
    const moList = await this.produceService.getMoList(request);
    const data = plainToInstance(GetMoList, moList, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(data)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async getLogTimeByMoId(payload: GetLogTimeByMoId): Promise<any> {
    const logTime = await this.produceService.getLogTimeByMoId(payload);
    const oeeData = await this.produceService.getInfoOeeByMo(
      payload.moIds,
      payload.wcId,
    );
    const workOrderTime = logTime.workOrders.map((workOrder) => {
      let { workCenterDailySchedules } = workOrder;
      workCenterDailySchedules = keyBy(
        workCenterDailySchedules,
        'executionDay',
      );
      const data = [];
      for (const key in workCenterDailySchedules) {
        const workCenterDailySchedule = workCenterDailySchedules[key];
        let totalShiftTime =
          workCenterDailySchedule.workCenterDailyScheduleShifts.reduce(
            (totalTime, shift) => {
              const start = moment(shift.workCenterShiftStartAt, 'HH:mm:ss');
              const end = moment(shift.workCenterShiftEndAt, 'HH:mm:ss');
              return (totalTime += end.diff(start, 'minutes'));
            },
            0,
          );
        totalShiftTime =
          totalShiftTime > MINUTES_IN_DAY ? MINUTES_IN_DAY : totalShiftTime;
        data.push({
          moName: workOrder.moName,
          moId: workOrder.moId,
          day: key,
          totalShiftTime,
          workingTime: workCenterDailySchedule.logTimeDuration,
          stopTime: totalShiftTime - workCenterDailySchedule.logTimeDuration,
        });
      }
      return data;
    });
    const workOrderTimeData = groupBy(flatten(workOrderTime), (item: any) => {
      return `${item.moId}-${item.day}`;
    });
    const data = [];
    for (const key in workOrderTimeData) {
      const logTimeData = workOrderTimeData[key];
      const totalWorkingTime = logTimeData.reduce(
        (workingTime, currentTime) => (workingTime += currentTime.workingTime),
        0,
      );
      const totalStopTime = logTimeData.reduce(
        (workingTime, currentTime) => (workingTime += currentTime.stopTime),
        0,
      );
      data.push({
        moId: first(logTimeData)?.moId,
        moName: first(logTimeData)?.moName,
        day: moment(first(logTimeData)?.day).format('DD/MM/YYYY'),
        workTime: totalWorkingTime,
        stopTime: totalStopTime,
      });
    }
    const listLogTime = plainToInstance(GetLogTimeByMoIdResponse, data, {
      excludeExtraneousValues: true,
    });
    const {
      totalActualExecutionTime,
      totalPlanExecutionTime,
      totalActualQuantity,
      totalQcPassQuantity,
      productivityRatio,
    } = oeeData;
    let oee = 0;
    if (
      totalActualExecutionTime &&
      totalPlanExecutionTime &&
      totalActualQuantity &&
      totalQcPassQuantity &&
      productivityRatio
    ) {
      const A = div(totalActualExecutionTime, totalPlanExecutionTime);
      const Q = div(totalQcPassQuantity, totalActualQuantity);
      const P = div(
        productivityRatio,
        div(totalActualQuantity, totalActualExecutionTime),
      );
      oee = A * Q * P * 100;
    }
    const result = {
      oee,
      logTimes: listLogTime,
    };
    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async getAttributeTypeByDeviceAssign(
    request: GetDeviceAssignRequestDto,
  ): Promise<ResponsePayload<any>> {
    const deviceAssignment =
      await this.deviceAssignmentRepository.getDetailDeviceAssignment(
        request.id,
        true,
        request.user.id,
      );

    if (!deviceAssignment) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.DEVICE_ASSIGNMENT_NOT_FOUND'),
      ).toResponse();
    }

    const attributeTypeIds = deviceAssignment.deviceId.attributeType;

    const attributeTypes =
      await this.attributeTypeRepository.findAllByCondition({
        _id: {
          $in: attributeTypeIds,
        },
      });

    const unitIds = attributeTypes.map((e) => e.unit);

    const units = await this.unitRepository.findAllByCondition({
      _id: {
        $in: unitIds,
      },
    });

    if (units) {
      const unitMap = new Map();
      units.forEach((unit) => {
        unitMap.set(unit._id, unit);
      });

      attributeTypes.forEach((e) => {
        e['unitObject'] = unitMap.get(e.unit).name;
      });
    }

    const dataReturn = plainToInstance(
      DetailAttributeTypeResponse,
      attributeTypes,
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder({
      workCenterId: deviceAssignment?.workCenterId,
      serial: deviceAssignment.serial,
      deviceName: deviceAssignment?.deviceId?.name,
      items: dataReturn,
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async getDeviceAssignmentByWorkCenterId(
    request: GetDeviceAssignmentByWorkCenterId,
  ) {
    const data = await this.deviceAssignmentRepository.findOneByCondition({
      workCenterId: request.workCenterId,
    });

    const response = plainToInstance(DetailDeviceAssignmentResponse, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }
}
