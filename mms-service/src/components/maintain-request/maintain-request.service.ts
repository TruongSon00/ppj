import { HistoryActionEnum } from './../history/history.constant';
import { DEVICE_ASIGNMENTS_STATUS_ENUM } from '@components/device-assignment/device-assignment.constant';
import { JobRepositoryInterface } from '@components/job/interface/job.repository.interface';
import {
  JOB_STATUS_ENUM,
  JOB_TYPE_ENUM,
  JOB_TYPE_MAINTENANCE_ENUM,
} from '@components/job/job.constant';
import { UserService } from '@components/user/user.service';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ApiError } from '@utils/api.error';
import { PagingResponse } from '@utils/paging.response';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { CreateMaintainRequestDto } from './dto/request/create-maintain-request.request.dto';
import { ListMaintainRequestDto } from './dto/request/list-maintain-request.request.dto';
import { UpdateMaintainRequestDto } from './dto/request/update-main-request.request.dto';
import { MaintainRequestRepositoryInterface } from './interface/maintain-request.repository.interface';
import { MaintainRequestServiceInterface } from './interface/maintain-request.service.interface';
import { MaintenanceTeamRepositoryInterface } from '@components/maintenance-team/interface/maintenance-team.repository.interface';
import { ProduceServiceInterface } from '@components/produce/interface/produce.service.interface';
import * as mongoose from 'mongoose';
import {
  HISTORY_ACTION,
  MAINTAIN_REQUEST_STATUS_ENUM,
  STATUS_TO_APPROVE_MAINTAIN_REQUEST,
  STATUS_TO_DELETE_OR_REJECT_MAINTAIN_REQUEST,
} from './maintain-request.constant';
import { DeviceRequestTicketStatus } from 'src/models/device-request-ticket/device-request-ticket.schema';
import { InjectConnection } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { SuccessResponse } from '@utils/success.response.dto';
import { ApproveMaintainRequestDto } from './dto/request/approve-maintain-request.request.dto';
import { isEmpty, keyBy, flatMap, uniqBy } from 'lodash';
import { ListMaintainRequestResponseDto } from './dto/response/list-maintain-request.response.dto';
import { DetailMaintainRequestResponseDto } from './dto/response/detail-maintain-request.response.dto';
import { SupplyRepositoryInterface } from '@components/supply/interface/supply.repository.interface';
import { UpdateMaintainRequestStatusDto } from './dto/request/update-status-maintain-request.request.dto';
import { GetMaintainRequestByAssignDeviceRequest } from './dto/request/get-maintain-request-by-assign-device.request.dto';
import { GetMaintainRequestByAssignDeviceResponse } from './dto/response/get-maintain-request-by-assign-device.response.dto';
import { DeviceAssignmentRepositoryInterface } from '@components/device-assignment/interface/device-assignment.repository.interface';
import { DeviceAssignmentServiceInterface } from '@components/device-assignment/interface/device-assignment.service.interface';
import { DeviceServiceInterface } from '@components/device/interface/device.service.interface';
import { DeviceRepositoryInterface } from '@components/device/interface/device.repository.interface';
import { ItemServiceInterface } from '@components/item/interface/item.service.interface';
import { DeviceRequestTicketRepositoryInterface } from '@components/device-request/interface/device-request-ticket.repository.interface';
import * as moment from 'moment';
import { GetMaintainRequestHistoriesDto } from './dto/request/get-maintain-request-history.request.dto';
import { MaintainRequestHistoriesResponseDto } from './dto/response/maintain-request-histories.response.dto';
import { CreateDeviceRequestTicketRequestDto } from '@components/device-request/dto/request/request-ticket/create-device-request-ticket.request.dto';
import { DeviceRequestServiceInterface } from '@components/device-request/interface/device-request.service.interface';
import { DEVICE_REQUEST_PREFIX_NAME } from '@components/device-request/device-request.constant';
import { UnitRepositoryInterface } from '@components/unit/interface/unit.repository.interface';

@Injectable()
export class MaintainRequestService implements MaintainRequestServiceInterface {
  constructor(
    @Inject('MaintainRequestRepositoryInterface')
    private readonly maintainRequestRepository: MaintainRequestRepositoryInterface,

    @Inject('JobRepositoryInterface')
    private readonly jobRepository: JobRepositoryInterface,

    @Inject('DeviceAssignmentRepositoryInterface')
    private readonly deviceAssignmentRepository: DeviceAssignmentRepositoryInterface,

    @Inject('MaintenanceTeamRepositoryInterface')
    private readonly maintenanceTeamRepository: MaintenanceTeamRepositoryInterface,

    @InjectConnection() private readonly connection: mongoose.Connection,
    @Inject('UserServiceInterface')
    private readonly userService: UserService,

    @Inject('SupplyRepositoryInterface')
    private readonly supplyRepository: SupplyRepositoryInterface,

    @Inject('DeviceRepositoryInterface')
    private readonly deviceRepository: DeviceRepositoryInterface,

    @Inject('DeviceRequestTicketRepositoryInterface')
    private readonly deviceRequestTicketRepository: DeviceRequestTicketRepositoryInterface,

    @Inject('ItemServiceInterface')
    private readonly itemService: ItemServiceInterface,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceServiceInterface,

    @Inject('DeviceAssignmentServiceInterface')
    private deviceAssigmentService: DeviceAssignmentServiceInterface,

    @Inject('DeviceServiceInterface')
    private deviceService: DeviceServiceInterface,

    @Inject('DeviceRequestServiceInterface')
    private deviceRequestService: DeviceRequestServiceInterface,

    @Inject('UnitRepositoryInterface')
    private unitRepository: UnitRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async create(
    payload: CreateMaintainRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { completeExpectedDate, supplies, deviceAssignmentId } = payload;
    if (
      moment(completeExpectedDate).isBefore(moment(), 'day') ||
      moment(completeExpectedDate).isAfter(moment().add(1, 'year'), 'day')
    ) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.COMPLETE_EXPECTED_DATE_INVALID'),
      ).toResponse();
    }
    const deviceAssginment = await this.deviceAssignmentRepository.findOneById(
      deviceAssignmentId,
    );
    if (!deviceAssginment) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.DEVICE_ASSIGNMENT_NOT_FOUND'),
      ).toResponse();
    }
    //@TODO: check srs điều kiện để tạo được yêu cầu bảo dưỡng thiết bị có liên quan đến yêu cầu cấp thiết bị không ?
    // const deviceRequestTicket =
    //   await this.deviceRequestTicketRepository.findOneById(
    //     deviceAssginment.deviceRequestId,
    //   );
    // if (
    //   deviceRequestTicket &&
    //   deviceRequestTicket.status !== DeviceRequestTicketStatus.Confirmed
    // ) {
    //   return new ApiError(
    //     ResponseCodeEnum.NOT_FOUND,
    //     await this.i18n.translate(
    //       'error.DEVICE_REQUEST_TICKET_NOT_ABLE_TO_CREATE_MAINTAIN_REQUEST',
    //     ),
    //   ).toResponse();
    // }
    if (!isEmpty(supplies)) {
      const supplyIds = supplies.map((supply) => supply.supplyId);
      const listSupply = await this.supplyRepository.getByIds(supplyIds);
      if (supplyIds.length !== listSupply.length)
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.LIST_SUPPLY_INVALID'),
        ).toResponse();
    }
    const user = await this.userService.detailUser(payload.userId);
    const text = await this.i18n.translate(
      'text.CREATED_MAINTAIN_REQUEST_HISTORY',
    );
    const request =
      await this.maintainRequestRepository.createMaintenanceRequest({
        ...payload,
        ...{
          histories: [
            {
              userId: user.data.id,
              userName: user.data.username,
              action: HISTORY_ACTION.CREATED,
              content: `${user.data.username} ${text}`,
              status: MAINTAIN_REQUEST_STATUS_ENUM.CREATED,
            },
          ],
        },
      });
    return new ResponseBuilder(request)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async update(payload: UpdateMaintainRequestDto): Promise<any> {
    const { id, completeExpectedDate, supplies, deviceAssignmentId } = payload;
    if (!isEmpty(supplies)) {
      const supplyIds = supplies.map((supply) => supply.supplyId);
      const listSupply = await this.supplyRepository.getByIds(supplyIds);
      if (supplyIds.length !== listSupply.length)
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.LIST_SUPPLY_INVALID'),
        ).toResponse();
    }

    if (deviceAssignmentId) {
      const deviceAssginment =
        await this.deviceAssignmentRepository.findOneById(deviceAssignmentId);
      if (!deviceAssginment)
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.DEVICE_ASSIGNMENT_NOT_FOUND'),
        ).toResponse();
    }
    const user = await this.userService.detailUser(payload.userId);
    const maintainRequest =
      await this.maintainRequestRepository.findByIdAndUpdate(id, payload);

    if (!maintainRequest) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.MAINTAIN_REQUEST_NOT_FOUND'),
      ).toResponse();
    }
    if (
      moment(completeExpectedDate).isBefore(moment(), 'day') ||
      moment(completeExpectedDate).isAfter(moment().add(1, 'year'), 'day')
    ) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.COMPLETE_EXPECTED_DATE_INVALID'),
      ).toResponse();
    }
    const text = await this.i18n.translate(
      'text.EDITED_MAINTAIN_REQUEST_HISTORY',
    );
    await this.maintainRequestRepository.findByIdAndUpdate(maintainRequest.id, {
      $push: {
        histories: {
          userId: user.data.id,
          userName: user.data.username,
          action: HISTORY_ACTION.UPDATED,
          content: `${user.data.username} ${text}`,
          status: maintainRequest.status,
        },
      },
    });
    return new ResponseBuilder(maintainRequest)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async delete(id: string): Promise<any> {
    const maintainRequest = await this.maintainRequestRepository.findOneById(
      id,
    );
    if (!maintainRequest) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.MAINTAIN_REQUEST_NOT_FOUND'),
      ).toResponse();
    }
    if (
      !STATUS_TO_DELETE_OR_REJECT_MAINTAIN_REQUEST.includes(
        maintainRequest.status,
      )
    )
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.STATUS_INVALID'),
      ).toResponse();

    const result = await this.maintainRequestRepository.deleteById(id);
    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async approve(request: ApproveMaintainRequestDto): Promise<any> {
    const maintainRequest = await this.maintainRequestRepository.findOneById(
      request.id,
    );
    const user = await this.userService.detailUser(request.userId);
    if (!maintainRequest) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.MAINTAIN_REQUEST_NOT_FOUND'),
      ).toResponse();
    }

    if (!STATUS_TO_APPROVE_MAINTAIN_REQUEST.includes(maintainRequest.status))
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.STATUS_INVALID'),
      ).toResponse();
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const text = await this.i18n.translate(
        'text.APPROVED_MAINTAIN_REQUEST_HISTORY',
      );
      const status =
        maintainRequest.status !== MAINTAIN_REQUEST_STATUS_ENUM.CONFIRMED_1
          ? MAINTAIN_REQUEST_STATUS_ENUM.CONFIRMED_1
          : MAINTAIN_REQUEST_STATUS_ENUM.CONFIRMED_2;
      const result = await this.maintainRequestRepository.findByIdAndUpdate(
        request.id,
        {
          status,
          $push: {
            histories: {
              userId: user.data.id,
              userName: user.data.username,
              action: HISTORY_ACTION.APPROVED,
              content: `${user.data.username} ${text}`,
              status,
            },
          },
        },
      );

      const dataReturn = plainToInstance(SuccessResponse, result, {
        excludeExtraneousValues: true,
      });
      if (maintainRequest.status === MAINTAIN_REQUEST_STATUS_ENUM.CONFIRMED_1) {
        const messageCreatedJob = await this.i18n.translate('text.CREATED_JOB');
        await this.jobRepository.createJobEntity({
          jobTypeId: maintainRequest._id,
          deviceAssignmentId: maintainRequest.deviceAssignmentId,
          type: JOB_TYPE_ENUM.MAINTENANCE_REQUEST,
          priority: maintainRequest.priority,
          histories: [
            {
              userId: user.data.id,
              action: HISTORY_ACTION.CREATED,
              content: `${user.data.username} ${messageCreatedJob}`,
              status: JOB_STATUS_ENUM.NON_ASSIGN,
            },
          ],
          supplies: result?.supplies || [],
        });
      }
      await session.commitTransaction();
      return new ResponseBuilder(dataReturn)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      await session.abortTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    } finally {
      await session.endSession();
    }
  }

  async reject(request: UpdateMaintainRequestStatusDto): Promise<any> {
    const maintainRequest = await this.maintainRequestRepository.findOneById(
      request.id,
    );
    const user = await this.userService.detailUser(request.userId);
    if (!maintainRequest) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.MAINTAIN_REQUEST_NOT_FOUND'),
      ).toResponse();
    }

    if (
      !STATUS_TO_DELETE_OR_REJECT_MAINTAIN_REQUEST.includes(
        maintainRequest.status,
      )
    )
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.STATUS_INVALID'),
      ).toResponse();
    const text = await this.i18n.translate(
      'text.REJECTED_MAINTAIN_REQUEST_HISTORY',
    );
    const result = await this.maintainRequestRepository.findByIdAndUpdate(
      request.id,
      {
        status: MAINTAIN_REQUEST_STATUS_ENUM.REJECTED,
        reason: request.reason,
        $push: {
          histories: {
            userId: user.data.id,
            userName: user.data.username,
            action: HISTORY_ACTION.REJECTED,
            content: `${user.data.username} ${text}`,
            status: MAINTAIN_REQUEST_STATUS_ENUM.REJECTED,
          },
        },
      },
    );
    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async list(request: ListMaintainRequestDto): Promise<any> {
    const { skip, take, total, data } =
      await this.maintainRequestRepository.getAll(request);
    const userIds = data.map((request) => request.userId);
    const users = await this.userService.listUserByIds(userIds);
    const userItem = keyBy(users.data, 'id');
    const result = data.map((request) => {
      return {
        ...request,
        ...{
          user: {
            id: userItem[request.userId].id,
            name: userItem[request.userId].username,
            fullName: userItem[request.userId].fullName,
          },
        },
      };
    });
    const dataReturn = plainToInstance(ListMaintainRequestResponseDto, result, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder<PagingResponse>({
      items: !isEmpty(dataReturn) ? dataReturn : [],
      meta: { total: total, page: skip },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async detail(id: string): Promise<any> {
    const maintainRequest = await this.maintainRequestRepository.getDetail(id);
    if (isEmpty(maintainRequest))
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.MAINTAIN_REQUEST_NOT_FOUND'),
      ).toResponse();
    const job = await this.jobRepository.findOneByCondition({
      type: JOB_TYPE_ENUM.MAINTENANCE_REQUEST,
      jobTypeId: maintainRequest[0]._id.toString(),
    });
    const user = await this.userService.detailUser(
      maintainRequest[0].deviceAssignment[0].deviceRequest[0].userId,
    );
    if (isEmpty(user)) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.USER_NOT_FOUND'),
      ).toResponse();
    }
    let workCenter = {};
    if (maintainRequest[0]?.deviceAssignment[0]?.workCenterId) {
      workCenter = await this.produceService.getDetailWorkCenter(
        maintainRequest[0]?.deviceAssignment[0]?.workCenterId,
      );
    }

    let responsibleUser = null;
    const assignUser = maintainRequest[0]?.deviceAssignment[0]?.assign || {};
    if (assignUser.id && assignUser.type === 0) {
      const userData = await this.userService.detailUser(Number(assignUser.id));
      if (userData?.data) {
        responsibleUser = {
          id: assignUser.id,
          username: userData?.data?.username,
          fullName: userData?.data?.fullName,
        };
      }
    } else if (assignUser.id && assignUser.type === 1) {
      const teamAssignee = await this.maintenanceTeamRepository.detail(
        assignUser.id,
      );
      if (teamAssignee?.name) {
        responsibleUser = {
          id: assignUser.id,
          username: teamAssignee?.name,
          fullName: teamAssignee?.name,
        };
      }
    }
    const detailCompany = await this.userService.detailCompany(
      user.data.companyId,
    );
    const userItem = {
      ...user.data,
      companyName: detailCompany.data.name,
      address: detailCompany.data.address,
    };
    const factory = await this.userService.getFactoryById(
      maintainRequest[0].deviceAssignment[0].factoryId,
    );
    const supplyIds =
      maintainRequest[0].supplies.map((supply) => supply.supplyId) || [];
    const actualSupplyIds = job?.actualSupplies
      ? job.actualSupplies.map((supply) => supply.supplyId)
      : [];
    const supplies = await this.supplyRepository.findAllByCondition({
      _id: { $in: [...supplyIds, ...actualSupplyIds] },
    });
    const supplyItem: any = keyBy(supplies, (value) => value._id.toString());
    const codes = flatMap(supplies, 'code');
    if (!isEmpty(codes)) {
      const quantityItemsInStock =
        await this.itemService.getItemQuantityInWarehouseByCode(codes);
      for (const key in supplyItem) {
        const supply = supplyItem[key];
        const quantityInStock = quantityItemsInStock.find(
          (item) => item.code === supply.code,
        )?.totalQuantity;
        supply.quantityInStock = +quantityInStock || 0;
      }
    }
    const itemUnitIds = flatMap(supplies, 'itemUnitId');
    const itemUnits = await this.unitRepository.findAllByCondition({
      _id: {
        $in: itemUnitIds,
      },
    });
    const result = maintainRequest?.map((request) => {
      const job = request?.job[0] || {};
      return {
        ...request,
        deviceAssignment: request.deviceAssignment.map((assign) => ({
          ...assign,
          user: userItem,
          factory,
          responsibleUser,
          workCenter,
        })),
        supplies:
          request?.supplies?.map((supply) =>
            this.getDetailSupply(supply, supplyItem, itemUnits),
          ) || [],
        actualSupplies:
          job?.actualSupplies?.map((supply) =>
            this.getDetailSupply(supply, supplyItem, itemUnits),
          ) || [],
        job: {
          ...job,
          maintenanceType: job?.result?.maintenanceType ?? null,
        },
      };
    });
    const dataReturn = plainToInstance(
      DetailMaintainRequestResponseDto,
      result,
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder(dataReturn[0])
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async getMaintainRequestByAssignDevice(
    request: GetMaintainRequestByAssignDeviceRequest,
  ): Promise<ResponsePayload<any>> {
    const { data, total } =
      await this.maintainRequestRepository.getMaintainRequestByAssignDevice(
        request,
      );

    const dataReturn = plainToInstance(
      GetMaintainRequestByAssignDeviceResponse,
      data,
      { excludeExtraneousValues: true },
    );

    return new ResponseBuilder<PagingResponse>({
      items: dataReturn,
      meta: { total: total, page: request.skip },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async completeMaintainRequest(request: UpdateMaintainRequestStatusDto) {
    const maintainRequest = await this.maintainRequestRepository.findOneById(
      request.id,
    );
    if (!maintainRequest) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.MAINTAIN_REQUEST_NOT_FOUND'),
      ).toResponse();
    }

    if (maintainRequest.status !== MAINTAIN_REQUEST_STATUS_ENUM.EXECUTED)
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.STATUS_INVALID'),
      ).toResponse();
    const deviceAssginment = await this.deviceAssignmentRepository.findOneById(
      maintainRequest.deviceAssignmentId,
    );
    const session = await this.connection.startSession();
    session.startTransaction();
    if (!deviceAssginment.usedAt) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.DEVICE_NOT_ASSIGN_USE_AT'),
      ).toResponse();
    }
    const job = await this.jobRepository.getJobByMaintainRequest(request.id);
    if (!job) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.MAINTAIN_REQUEST_NOT_CLASSIFY_JOB'),
      ).toResponse();
    }
    const deviceAssignmentHistory = deviceAssginment.histories.concat({
      userId: request.userId,
      action: HistoryActionEnum.UPDATE,
      createdAt: new Date(),
      planCode: job.code,
      planFrom: job.planFrom,
      planTo: job.planTo,
      jobType: job.type,
      jobId: job._id,
    });
    await this.deviceAssignmentRepository.findByIdAndUpdate(
      maintainRequest.deviceAssignmentId,
      {
        status:
          job?.result?.maintenanceType === JOB_TYPE_MAINTENANCE_ENUM.MAINTENANCE
            ? DEVICE_ASIGNMENTS_STATUS_ENUM.IN_USE
            : DEVICE_ASIGNMENTS_STATUS_ENUM.IN_SCRAPPING,
        histories: deviceAssignmentHistory,
      },
    );
    const user = await this.userService.detailUser(request.userId);
    try {
      const messageCompletedJob = await this.i18n.translate(
        'text.COMPLETED_JOB_HISTORY',
      );
      const { maintainRequestHistories = [] } = deviceAssginment;
      let lastMaintainRequest;
      if (!isEmpty(maintainRequestHistories)) {
        const lastMaintainRequestId =
          maintainRequestHistories[maintainRequestHistories.length - 1]
            .maintainRequestId;
        lastMaintainRequest = await this.maintainRequestRepository.findOneById(
          lastMaintainRequestId,
        );
      }
      const countMaintenanceTimes = maintainRequestHistories.length + 1;
      const sumOfField = (items, props, initValue) => {
        return items.reduce((pre, cur) => {
          return !cur[props] ? pre : +pre + +cur[props];
        }, initValue);
      };
      const {
        usedTimeUntilMaintenance,
        usedTimeUntilReplace,
        errorConfirmationTime,
        maintenanceExecutionTime,
      } = await this.deviceAssigmentService.calculateDeviceAssignmentIndexes(
        job,
        deviceAssginment,
        maintainRequest,
      );
      const information =
        await this.deviceAssigmentService.updateDeviceAssignInfomation(
          deviceAssginment,
          maintainRequest,
        );
      if (
        job?.result?.maintenanceType === JOB_TYPE_MAINTENANCE_ENUM.MAINTENANCE
      ) {
        const mtbfIndex =
          sumOfField(
            maintainRequestHistories,
            'mtbfIndex',
            usedTimeUntilMaintenance,
          ) / countMaintenanceTimes;
        const mttaIndex =
          sumOfField(
            maintainRequestHistories,
            'mttaIndex',
            errorConfirmationTime,
          ) / countMaintenanceTimes;
        const mttrIndex =
          sumOfField(
            maintainRequestHistories,
            'mttrIndex',
            maintenanceExecutionTime,
          ) / countMaintenanceTimes;
        const supplyIndex = await this.deviceAssigmentService.calcSupplyIndex(
          maintainRequest,
          deviceAssginment,
          lastMaintainRequest,
          job,
        );
        const supplyHistories = supplyIndex.map((sup) => ({
          supplyId: sup?.supplyId,
          usageTimeToMaintenance: sup?.usageTimeToMaintenance,
          usageTimeToReplace: sup?.usageTimeToReplace,
          confirmationTime: sup?.confirmationTime,
          repairTime: sup?.repairTime,
          maintenanceType: sup?.maintenanceType,
        }));

        const supplyIndexs = (
          uniqBy(
            [...supplyIndex, ...(deviceAssginment?.supplyIndex || [])],
            (e) => e.supplyId.toString(),
          ) || []
        ).map((supplyInd) => ({
          supplyId: supplyInd?.supplyId,
          estMaintenceDate: supplyInd?.estMaintenceDate,
          estReplaceDate: supplyInd?.estReplaceDate,
          mttrIndex: supplyInd?.mttrIndex,
          mttaIndex: supplyInd?.mttaIndex,
          mtbfIndex: supplyInd?.mtbfIndex,
          mttfIndex: supplyInd?.mttfIndex,
        }));
        await this.deviceAssignmentRepository.findByIdAndUpdate(
          `${deviceAssginment._id}`,
          {
            mtbfIndex,
            mttrIndex,
            mttaIndex,
            status: DEVICE_ASIGNMENTS_STATUS_ENUM.IN_USE,
            information,
            supplyIndex: supplyIndexs,
            $push: {
              maintainRequestHistories: {
                mtbfIndex: usedTimeUntilMaintenance,
                mttaIndex: errorConfirmationTime,
                mttrIndex: maintenanceExecutionTime,
                maintainRequestId: maintainRequest._id,
                supplyHistories,
              },
            },
          },
        );
      }
      if (job?.result?.maintenanceType === JOB_TYPE_MAINTENANCE_ENUM.REPLACE) {
        const mttfIndex = usedTimeUntilReplace;
        const mttaIndex =
          sumOfField(
            maintainRequestHistories,
            'mttaIndex',
            errorConfirmationTime,
          ) / countMaintenanceTimes;
        const mttrIndex =
          sumOfField(
            maintainRequestHistories,
            'mttrIndex',
            maintenanceExecutionTime,
          ) / countMaintenanceTimes;
        this.deviceAssignmentRepository.findByIdAndUpdate(
          `${deviceAssginment._id}`,
          {
            mttfIndex,
            mttrIndex,
            mttaIndex,
            status: DEVICE_ASIGNMENTS_STATUS_ENUM.IN_SCRAPPING,
            information,
            $push: {
              maintainRequestHistories: {
                mttfIndex: usedTimeUntilReplace,
                mttaIndex: errorConfirmationTime,
                mttrIndex: maintenanceExecutionTime,
                maintainRequestId: maintainRequest._id,
              },
            },
          },
        );
      }
      await this.deviceService.updateDeviceIndex(deviceAssginment.deviceId);
      await session.commitTransaction();

      const deviceAssignment =
        await this.deviceAssignmentRepository.detailDeviceAssignment(
          maintainRequest.deviceAssignmentId,
        );
      if (
        deviceAssignment[0]?.status ===
        DEVICE_ASIGNMENTS_STATUS_ENUM.IN_SCRAPPING
      ) {
        const device = deviceAssignment[0].device[0];
        const code = await this.deviceRequestService.generateTicketCode();
        let workCenters = await this.produceService.getWorkCenters({
          isGetAll: '1',
          filter: [{ column: 'status', text: '2' }],
        });
        const deviceAssign =
          await this.deviceAssignmentRepository.findAllByCondition({
            workCenterId: { $ne: null },
          });
        const deviceAssignmentWorkCenters = flatMap(
          deviceAssign,
          'workCenterId',
        );
        workCenters = workCenters?.items.filter(
          (workCenter) => !deviceAssignmentWorkCenters.includes(workCenter.id),
        );

        if (!workCenters.length) {
          return new ApiError(
            ResponseCodeEnum.NOT_FOUND,
            await this.i18n.translate('error.CANNOT_FIND_VALID_WORK_CENTER'),
          ).toResponse();
        }
        // const par = {
        //   name: `${DEVICE_REQUEST_PREFIX_NAME} ${device?.name}`,
        //   description: device?.name,
        //   userId: request.userId,
        //   quantity: 1,
        //   workCenterId: workCenters[0].id || null,
        //   deviceId: device?._id,
        //   userCreatorId: request.userId,
        // } as CreateDeviceRequestTicketRequestDto;
        // const deviceRequestTicketDocument =
        //   await this.deviceRequestTicketRepository.createDocument(par, code);
        // const deviceRequestTicket =
        //   await this.deviceRequestTicketRepository.create(
        //     deviceRequestTicketDocument,
        //   );
        // deviceRequestTicket.histories.push({
        //   userId: request.userId,
        //   action: HistoryActionEnum.CREATE,
        //   createdAt: new Date(),
        // });
        // await deviceRequestTicket.save();
      }
      const text = await this.i18n.translate(
        'text.COMPLETED_MAINTAIN_REQUEST_HISTORY',
      );
      const result = await this.maintainRequestRepository.findByIdAndUpdate(
        request.id,
        {
          status: MAINTAIN_REQUEST_STATUS_ENUM.COMPLETED,
          $push: {
            histories: {
              userId: user.data.id,
              userName: user.data.username,
              action: HISTORY_ACTION.COMPLETED,
              content: `${user.data.username} ${text}`,
              status: MAINTAIN_REQUEST_STATUS_ENUM.COMPLETED,
            },
          },
        },
      );
      const dataReturn = plainToInstance(SuccessResponse, result, {
        excludeExtraneousValues: true,
      });
      await this.jobRepository.findByIdAndUpdate(`${job._id}`, {
        status: JOB_STATUS_ENUM.RESOLVED,
        $push: {
          histories: {
            userId: user.data.id,
            action: HISTORY_ACTION.COMPLETED,
            content: `${user.data.username} ${messageCompletedJob}`,
            status: JOB_STATUS_ENUM.RESOLVED,
          },
        },
      });
      return new ResponseBuilder(dataReturn)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      await session.abortTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    } finally {
      await session.endSession();
    }
  }

  async reDoingMaintainRequest(request: UpdateMaintainRequestStatusDto) {
    const maintainRequest = await this.maintainRequestRepository.findOneById(
      request.id,
    );
    if (!maintainRequest) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.MAINTAIN_REQUEST_NOT_FOUND'),
      ).toResponse();
    }

    if (maintainRequest.status !== MAINTAIN_REQUEST_STATUS_ENUM.EXECUTED)
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.STATUS_INVALID'),
      ).toResponse();
    const job = await this.jobRepository.getJobByMaintainRequest(request.id);
    if (!job)
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.JOB_NOT_FOUND'),
      ).toResponse();
    const user = await this.userService.detailUser(request.userId);
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const text = await this.i18n.translate(
        'text.RE_DO_MAINTAIN_REQUEST_HISTORY',
      );
      const result = await this.maintainRequestRepository.findByIdAndUpdate(
        request.id,
        {
          status: MAINTAIN_REQUEST_STATUS_ENUM.IN_PROGRESS,
          $push: {
            histories: {
              userId: user.data.id,
              userName: user.data.username,
              action: HISTORY_ACTION.RE_DO,
              content: `${user.data.username} ${text}`,
              status: MAINTAIN_REQUEST_STATUS_ENUM.IN_PROGRESS,
            },
          },
        },
      );

      const dataReturn = plainToInstance(SuccessResponse, result, {
        excludeExtraneousValues: true,
      });
      const messageRedoJob = await this.i18n.translate(
        'text.RE_DO_JOB_HISTORY',
      );
      await this.jobRepository.findByIdAndUpdate(`${job._id}`, {
        status: JOB_STATUS_ENUM.IN_PROGRESS,
        reason: request.reason,
        $push: {
          histories: {
            userId: user.data.id,
            userName: user.data.username,
            action: HISTORY_ACTION.RE_DO,
            content: `${user.data.username} ${messageRedoJob}`,
            status: JOB_STATUS_ENUM.IN_PROGRESS,
          },
        },
      });
      await session.commitTransaction();
      return new ResponseBuilder(dataReturn)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      await session.abortTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    } finally {
      await session.endSession();
    }
  }

  async getMaintainRequestHistory(request: GetMaintainRequestHistoriesDto) {
    const maintainRequest = await this.maintainRequestRepository.findOneById(
      request.id,
    );
    if (!maintainRequest) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }
    const data = plainToInstance(
      MaintainRequestHistoriesResponseDto,
      maintainRequest.histories,
      {
        excludeExtraneousValues: true,
      },
    );
    return new ResponseBuilder(data)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .build();
  }

  getDetailSupply(supply, supplyList, itemUnits) {
    return {
      _id: supply.supplyId,
      name: supplyList[supply.supplyId.toString()]?.name,
      quantity: supply.quantity || 0,
      maintainType: supply.maintenanceType || 0,
      itemUnit: itemUnits?.find(
        (unit) => unit._id === supplyList[supply.supplyId].itemUnitId,
      ),
    };
  }
}
