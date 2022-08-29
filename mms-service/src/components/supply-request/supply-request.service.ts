import { UpdateSupplyRequest } from './dto/request/update-supply-request.request';
import { DeviceAssignmentRepositoryInterface } from '@components/device-assignment/interface/device-assignment.repository.interface';
import { DeviceRequestTicketRepositoryInterface } from '@components/device-request/interface/device-request-ticket.repository.interface';
import { HistoryActionEnum } from '@components/history/history.constant';
import { JobRepositoryInterface } from '@components/job/interface/job.repository.interface';
import { MaintenanceTeamRepositoryInterface } from '@components/maintenance-team/interface/maintenance-team.repository.interface';
import { SupplyRepositoryInterface } from '@components/supply/interface/supply.repository.interface';
import { UserService } from '@components/user/user.service';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ApiError } from '@utils/api.error';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToInstance } from 'class-transformer';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { DeviceRequestTicketStatus } from 'src/models/device-request-ticket/device-request-ticket.schema';
import { ListDeviceRequestImoQuery } from './dto/query/list-device-request-imo.query';
import { ListSupplyRequestQuery } from './dto/query/list-supply-request.query';
import { CreateSupplyRequest } from './dto/request/create-supply-request.request';
import { ListDeviceRequestImo } from './dto/response/list-device-request-imo.response.dto';
import { ListSupplyRequestResponse } from './dto/response/list-supply-request.response';
import { SupplyRequestRepositoryInterface } from './interface/supply-request.repository.interface';
import { SupplyRequestServiceInterface } from './interface/supply-request.service.interface';
import {
  SUPPLY_REQUEST_STATUS_ENUM,
  SUPPLY_REQUEST_TYPE_ENUM,
} from './supply-request.constant';
import * as moment from 'moment';
import { DetailSupplyRequestRequest } from './dto/request/detail-supply-request.request';
import { DetailSuppyRequestResponse } from './dto/response/detail-supply-request.response';
import { ItemService } from '@components/item/item.service';
import { ProduceService } from '@components/produce/produce.service';
import { RejectSupplyRequestRequest } from './dto/request/reject-supply-request.request';
import { ConfirmSupplyRequestRequest } from './dto/request/confirm-supply-request.request';
import { ApproveSupplyRequestRequest } from './dto/request/approve-supply-request.request';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { DEPARTMENT_PERMISSION_SETTING_CAN_SEE } from '@utils/permissions/department-permission-setting';
import { SaleService } from '@components/sale/sale.service';
import {
  ItemPORequest,
  CreatePurchasedOrderDto,
} from '@components/sale/dto/create-purchase-order.request';
import { minus, plus } from '@utils/common';
import { flatMap, isEmpty, map, orderBy, uniq, keyBy } from 'lodash';
import { UpdateActualQuantityRequest } from './dto/request/update-actual-quantity.request';
import { DeviceRepositoryInterface } from '@components/device/interface/device.repository.interface';
import { MAINTENANCE_TEAM_CONST } from '@components/maintenance-team/maintenance-team.constant';
import { PREFIX_PO_CODE } from '@components/sale/sale.constant';
import { GetHistorySupplyRequestRequest } from './dto/request/get-history-supply-request.request';
import { GetHistorySupplyResponse } from './dto/response/get-history-supply-request.response';
import { UnitRepositoryInterface } from '@components/unit/interface/unit.repository.interface';
import { DEVICE_REQUEST_STATUS_ENUM } from '@components/device-request/device-request.constant';

@Injectable()
export class SupplyRequestService implements SupplyRequestServiceInterface {
  constructor(
    @Inject('SupplyRequestRepositoryInterface')
    private readonly supplyRequestRepository: SupplyRequestRepositoryInterface,

    @Inject('SupplyRepositoryInterface')
    private readonly supplyRepository: SupplyRepositoryInterface,

    @Inject('DeviceAssignmentRepositoryInterface')
    private readonly deviceAssignmentRepository: DeviceAssignmentRepositoryInterface,

    @Inject('JobRepositoryInterface')
    private readonly jobRepository: JobRepositoryInterface,

    @Inject('MaintenanceTeamRepositoryInterface')
    private readonly maintenanceTeamRepository: MaintenanceTeamRepositoryInterface,

    @Inject('DeviceRequestTicketRepositoryInterface')
    private readonly deviceRequestTicketRepository: DeviceRequestTicketRepositoryInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserService,

    @Inject('ItemServiceInterface')
    private readonly itemService: ItemService,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceService,

    @Inject('SaleServiceInterface')
    private readonly saleService: SaleService,

    @Inject('DeviceRepositoryInterface')
    private readonly deviceRepository: DeviceRepositoryInterface,

    @Inject('UnitRepositoryInterface')
    private readonly unitRepository: UnitRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async create(request: CreateSupplyRequest): Promise<ResponsePayload<any>> {
    const supplyIds = request.supplies.map((e) => e.supplyId);
    const supplyExists = await this.supplyRepository.findAllByCondition({
      _id: {
        $in: supplyIds,
      },
    });

    if (supplyExists.length !== supplyIds.length) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.SUPPLY_NOT_FOUND'),
      ).toResponse();
    }

    const job = await this.jobRepository.findOneById(request.jobId);

    if (!job) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.JOB_NOT_FOUND'),
      ).toResponse();
    }

    const deviceAssignment = await this.deviceAssignmentRepository.findOneById(
      job.deviceAssignmentId,
    );

    if (!deviceAssignment) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.DEVICE_ASSIGNMENT_NOT_FOUND'),
      ).toResponse();
    }

    const maintainTeam = await this.maintenanceTeamRepository.findOneByUserId(
      request.user.id,
    );

    const isManufacture = false;
    let teamId;
    if (!isEmpty(maintainTeam)) {
      teamId = maintainTeam._id;
    }

    const document = await this.supplyRequestRepository.createDocument(
      request,
      SUPPLY_REQUEST_TYPE_ENUM.REQUEST,
      job.deviceAssignmentId,
      isManufacture,
      teamId,
    );

    document.histories.push({
      userId: request.user.id,
      action: HistoryActionEnum.CREATE,
      content: `${request.user.username} đã tạo yêu cầu`,
      status: document.status,
      createdAt: new Date(),
    });

    await this.supplyRequestRepository.create(document);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async list(request: ListSupplyRequestQuery): Promise<ResponsePayload<any>> {
    const { data, count } = await this.supplyRequestRepository.list(request);

    const userIds = [];
    const teamIds = [];
    data.forEach((e) => {
      if (e.requestedBy?.userId) userIds.push(e.requestedBy?.userId);
      if (e.requestedBy?.teamId) teamIds.push(e.requestedBy?.teamId);
    });

    const users = await this.userService.getListByIDs(userIds);
    const teams = await this.maintenanceTeamRepository.findAllByCondition({
      _id: {
        $in: teamIds,
      },
    });
    const userMap = new Map();
    const teamMap = new Map();
    users.forEach((e) => {
      userMap.set(e.id, e);
    });
    teams.map((e) => {
      teamMap.set(e._id.toString(), e);
    });
    data.forEach((e) => {
      e.teamName = teamMap.get(e.requestedBy?.teamId?.toString())?.name || null;
      e.fullName = userMap.get(e.requestedBy?.userId)?.fullName || null;
    });

    const dataReturn = plainToInstance(ListSupplyRequestResponse, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder({
      items: dataReturn,
      meta: { total: count, page: request.page, size: request.limit },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async listImo(
    request: ListDeviceRequestImoQuery,
  ): Promise<ResponsePayload<any>> {
    const items: ListDeviceRequestImo[] = [];
    const supplyRequests =
      await this.supplyRequestRepository.findAllWithPopulate(
        {
          status: SUPPLY_REQUEST_STATUS_ENUM.WAITING_EXPORT,
        },
        {
          path: 'deviceAssignmentId',
        },
      );

    const deviceRequests =
      await this.deviceRequestTicketRepository.findAllWithPopulate(
        {
          status: DeviceRequestTicketStatus.WaitingExport,
        },
        {
          path: 'device',
        },
      );

    supplyRequests.forEach((e) => {
      items.push({
        id: e._id,
        code: e.code,
        name: e.name,
        description: e.description,
        planFrom: e.receiveExpectedDate,
        planTo: e.receiveExpectedDate,
        createdAt: e.createdAt,
        type: e.type,
        items: e.supplies.map((v) => ({
          id: v['supplyId']['_id'],
          code: v['supplyId']['code'],
          planQuantity: v.quantity,
          type: e.type,
          unit: 1,
        })),
      });
    });

    deviceRequests.forEach((e) => {
      items.push({
        id: e._id,
        code: e.code,
        name: e.name,
        description: e.description,
        planFrom: e.createdAt,
        createdAt: e.createdAt,
        planTo: moment(e.createdAt).add(1, 'day').toDate(),
        type: 2,
        items: [
          {
            id: e.deviceGroupIds.toString(),
            code: e['device']['code'],
            planQuantity: e.quantity,
            type: 2,
            unit: 1,
          },
        ],
      });
    });

    return new ResponseBuilder({
      items: orderBy(items, 'createdAt', 'desc'),
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async delete(
    request: DetailSupplyRequestRequest,
  ): Promise<ResponsePayload<any>> {
    try {
      const document = await this.supplyRequestRepository.findOneById(
        request.id,
      );

      if (!document) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.NOT_FOUND'),
        ).toResponse();
      }

      document.deletedAt = new Date();
      await document.save();

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async detailImo(
    request: DetailSupplyRequestRequest,
  ): Promise<ResponsePayload<any>> {
    let data: any[];
    let flag = 0;
    data = await this.supplyRequestRepository.findAllWithPopulate(
      {
        status: SUPPLY_REQUEST_STATUS_ENUM.WAITING_EXPORT,
        _id: request.id,
      },
      {
        path: 'deviceAssignmentId',
      },
    );

    if (data.length) flag = 1;

    if (!data.length) {
      data = await this.deviceRequestTicketRepository.findAllWithPopulate(
        {
          status: DeviceRequestTicketStatus.WaitingExport,
          _id: request.id,
        },
        {
          path: 'device',
        },
      );
      if (data.length) flag = 2;
    }

    if (!data.length) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const key = flag === 1 ? 'supplies' : flag === 3 ? 'deviceAssignments' : '';

    const items: ListDeviceRequestImo = {
      id: data[0]._id,
      code: data[0].code,
      description: data[0].description,
      name: data[0].name,
      planFrom: data[0].createdAt,
      planTo: moment(data[0].createdAt).add(1, 'day').toDate(),
      type: 1,
      items:
        flag === 2
          ? [
              {
                id: data[0].device._id.toString(),
                code: data[0]['device']['code'],
                planQuantity: data[0].quantity,
                type: data[0]?.type || 1,
                unit: 1,
              },
            ]
          : data[0][key].map((v) => ({
              id: flag === 1 ? v['supplyId']['_id'] : v['deviceId']._id,
              code: flag === 1 ? v['supplyId']['code'] : v['deviceId'].code,
              planQuantity: v?.quantity || 1,
              type: data[0]?.type || 1,
              unit: 1,
            })),
    };

    return new ResponseBuilder(items)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async detail(
    request: DetailSupplyRequestRequest,
  ): Promise<ResponsePayload<any>> {
    const supplyRequest = await this.supplyRequestRepository.detail(request);

    if (!supplyRequest) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const { userId, teamId } = supplyRequest.requestedBy;

    if (userId) {
      const user = await this.userService.detailUser(userId);
      supplyRequest.requestBy = user?.data?.username || null;
    }

    if (teamId) {
      const team = await this.maintenanceTeamRepository.findOneById(teamId);
      supplyRequest.team = team?.name || null;
    }

    const { factoryId, workCenterId } = supplyRequest.deviceAssignmentId || {};

    const workCenter = await this.produceService.getDetailWorkCenter(
      workCenterId,
    );
    supplyRequest.workCenter = workCenter?.name;

    const factory = await this.userService.detailFactory(factoryId);
    supplyRequest.factory = factory?.data?.name;

    const unitIds = supplyRequest.supplies.map((e) => e.supplyId?.itemUnitId);
    const units = await this.unitRepository.findAllByCondition({
      _id: unitIds,
    });
    const unitMap = new Map();
    units.forEach((unit) => {
      unitMap.set(unit._id, unit.name);
    });

    const supplyIds = supplyRequest.supplies.map((e) => e.supplyId._id);

    const supplyRequestPlan =
      await this.supplyRequestRepository.findAllByCondition({
        deletedAt: null,
        'supplies.supplyId': {
          $in: supplyIds,
        },
        _id: {
          $ne: supplyRequest._id,
        },
        status: SUPPLY_REQUEST_STATUS_ENUM.WAITING_EXPORT,
      });

    const supplyMap = new Map();
    supplyRequestPlan.forEach((e) => {
      e.supplies.forEach((supply) => {
        supplyMap.set(
          supply.supplyId.toString(),
          plus(
            supplyMap.get(supply.supplyId.toString()) || 0,
            supply.quantity || 0,
          ),
        );
      });
    });

    for (let i = 0; i < supplyRequest.supplies.length; i++) {
      const supply = supplyRequest.supplies[i];

      const itemStock = await this.itemService.getItemQuantityInWarehouses(
        supply.supplyId.code,
      );

      supply.unit = unitMap.get(supply.supplyId.itemUnitId) || null;
      supply.stockQuantity = itemStock?.quantity || 0;
      supply.planQuantity = supplyMap.get(supply.supplyId._id.toString()) || 0;
      supply.buyQuantity = minus(
        plus(supply.quantity || 0, supply.stockQuantity || 0),
        minus(supply.stockQuantity || 0, supply.planQuantity || 0),
      );
    }

    const dataReturn = plainToInstance(
      DetailSuppyRequestResponse,
      supplyRequest,
      {
        excludeExtraneousValues: true,
      },
    );

    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async reject(
    request: RejectSupplyRequestRequest,
  ): Promise<ResponsePayload<any>> {
    const checkPermission = await this.checkRuleItOrAdmin(request.user);

    if (!checkPermission) {
      return new ApiError(
        ResponseCodeEnum.FORBIDDEN,
        await this.i18n.translate('error.FORBIDDEN'),
      ).toResponse();
    }

    const supplyRequest = await this.supplyRequestRepository.findOneByCondition(
      {
        _id: request.id,
        deletedAt: null,
      },
    );

    if (!supplyRequest) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    if (supplyRequest.status !== SUPPLY_REQUEST_STATUS_ENUM.WAITING_CONFIRM) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CAN_NOT_REJECT'),
      ).toResponse();
    }

    supplyRequest.status = SUPPLY_REQUEST_STATUS_ENUM.REJECT;
    await supplyRequest.save();

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async confirm(
    request: ConfirmSupplyRequestRequest,
  ): Promise<ResponsePayload<any>> {
    const checkPermission = await this.checkRuleItOrAdmin(request.user);

    if (!checkPermission) {
      return new ApiError(
        ResponseCodeEnum.FORBIDDEN,
        await this.i18n.translate('error.FORBIDDEN'),
      ).toResponse();
    }

    const supplyRequest = await this.supplyRequestRepository.detail(request);

    if (!supplyRequest) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    if (supplyRequest.status !== SUPPLY_REQUEST_STATUS_ENUM.WAITING_CONFIRM) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CAN_NOT_CONFIRM'),
      ).toResponse();
    }

    const supplyIds = supplyRequest.supplies.map((e) => e.supplyId._id);

    const supplyRequestPlan =
      await this.supplyRequestRepository.findAllByCondition({
        deletedAt: null,
        'supplies.supplyId': {
          $in: supplyIds,
        },
        _id: {
          $ne: supplyRequest._id,
        },
        status: SUPPLY_REQUEST_STATUS_ENUM.WAITING_EXPORT,
      });

    const supplyMap = new Map();
    supplyRequestPlan.forEach((e) => {
      e.supplies.forEach((supply) => {
        supplyMap.set(
          supply.supplyId.toString(),
          plus(supplyMap.get(supply.supplyId.toString()) || 0, supply.quantity),
        );
      });
    });

    const itemPO: ItemPORequest[] = [];
    for (let i = 0; i < supplyRequest.supplies.length; i++) {
      const supply = supplyRequest.supplies[i];

      const itemStock = await this.itemService.getItemQuantityInWarehouses(
        supply.supplyId.code,
      );
      const itemDetail = await this.itemService.detailItem(
        supply.supplyId.code,
      );

      if (!isEmpty(itemStock)) {
        // Update quantity
        supply.stockQuantity = itemStock?.quantity || 0;
        supply.planQuantity =
          supplyMap.get(supply.supplyId._id.toString()) || 0;
        supply.buyQuantity = minus(
          plus(supply.quantity, supply.stockQuantity),
          minus(supply.stockQuantity, supply.planQuantity),
        );
      }

      if (
        (isEmpty(itemStock) ||
          (!isEmpty(itemStock) && itemStock.quantity < supply.quantity)) &&
        itemDetail?.code === supply?.supplyId?.code
      ) {
        itemPO.push({
          quantity: minus(supply.quantity, itemStock?.quantity || 0),
          id: itemDetail.id,
        });
      }
    }

    if (!isEmpty(itemPO)) {
      const purchaseOrder = new CreatePurchasedOrderDto();
      const purchaseCode = `${PREFIX_PO_CODE}${request.id.slice(
        request.id.length - 5,
        request.id.length,
      )}`;
      purchaseOrder.createdByUserId = request.user.id;
      purchaseOrder.userId = request.user.id;
      purchaseOrder.items = itemPO;
      purchaseOrder.type = 0;
      purchaseOrder.deadline = supplyRequest.receiveExpectedDate;
      purchaseOrder.purchasedAt = new Date();
      purchaseOrder.code = purchaseCode;
      purchaseOrder.companyId = request?.user?.companyId ?? null;
      purchaseOrder.name = (
        await this.i18n.translate('text.supplyRequestPOName')
      ).replace('POCode', purchaseCode);

      const purchaseResponse = await this.saleService.createPO(purchaseOrder);

      if (purchaseResponse.statusCode !== ResponseCodeEnum.SUCCESS) {
        return new ApiError(
          purchaseResponse.statusCode,
          purchaseResponse.message,
        ).toResponse();
      }
    }

    supplyRequest.status = SUPPLY_REQUEST_STATUS_ENUM.WAITING_EXPORT;
    supplyRequest.histories.push({
      userId: request.user.id,
      action: HistoryActionEnum.UPDATE,
      content: `${request.user.username} đã chuyển trạng thái sang chờ xuất kho`,
      status: supplyRequest.status,
      createdAt: new Date(),
    });
    await supplyRequest.save();

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async approve(
    request: ApproveSupplyRequestRequest,
  ): Promise<ResponsePayload<any>> {
    const checkPermission = await this.checkRuleItOrAdmin(request.user);

    if (!checkPermission) {
      return new ApiError(
        ResponseCodeEnum.FORBIDDEN,
        await this.i18n.translate('error.FORBIDDEN'),
      ).toResponse();
    }

    const supplyRequest = await this.supplyRequestRepository.findOneByCondition(
      {
        _id: request.id,
        deletedAt: null,
      },
    );

    if (!supplyRequest) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    if (supplyRequest.status !== SUPPLY_REQUEST_STATUS_ENUM.WAITING_EXPORT) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.CAN_NOT_COMPLETED'),
      ).toResponse();
    }

    supplyRequest.status = SUPPLY_REQUEST_STATUS_ENUM.COMPLETED;
    await supplyRequest.save();

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  // private checkRuleItOrAdmin(user: UserInforRequestDto): boolean {
  //   let checkPermission = false;
  //   user.departmentSettings.forEach((department) => {
  //     if (DEPARTMENT_PERMISSION_SETTING_CAN_SEE.includes(department.id)) {
  //       checkPermission = true;
  //     }
  //   });

  //   return checkPermission;
  // }
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

  async updateActualQuantity(
    request: UpdateActualQuantityRequest,
  ): Promise<ResponsePayload<any>> {
    const itemCodes = flatMap(request.items, 'code');
    const devices = await this.deviceRepository.findAllByCondition({
      code: { $in: itemCodes },
    });
    const supplies = await this.supplyRepository.findAllByCondition({
      code: { $in: itemCodes },
    });
    const deviceIds = flatMap(devices, (device) => device._id.toString());
    const supplyIds = flatMap(supplies, (supply) => supply._id.toString());
    const itemIds = [...deviceIds, ...supplyIds];

    const itemMap = new Map();
    request.items.forEach((e) => {
      const item = [...devices, ...supplies].find((i) => i.code === e.code);
      itemMap.set(item._id.toString(), e.quantity);
    });

    const deviceRequest =
      await this.deviceRequestTicketRepository.findOneByCondition({
        _id: request.requestId,
        device: {
          $in: itemIds,
        },
      });

    const supplyRequest = await this.supplyRequestRepository.findOneByCondition(
      {
        _id: request.requestId,
        'supplies.supplyId': {
          $in: itemIds,
        },
      },
    );

    if (
      !isEmpty(deviceRequest) &&
      itemMap.get(deviceRequest.deviceGroupIds.toString())
    ) {
      deviceRequest.status = DEVICE_REQUEST_STATUS_ENUM.WAITING_ASSIGNMENT;
      await deviceRequest.save();
    }

    if (!isEmpty(supplyRequest)) {
      let count = 0;
      for (let j = 0; j < supplyRequest.supplies.length; j++) {
        const supply = supplyRequest.supplies[j];
        if (itemMap.get(supply.supplyId.toString())) {
          supply.actualImportQuantity = plus(
            supply.actualImportQuantity,
            itemMap.get(supply.supplyId.toString()),
          );
        }
        if (supply.actualImportQuantity > supply.quantity) {
          return new ApiError(
            ResponseCodeEnum.BAD_REQUEST,
            await this.i18n.translate('error.ORDER_ITEM_QUANTITY_TOO_LARGE'),
          ).toResponse();
        }
        if (supply.actualImportQuantity === supply.quantity) {
          count++;
        }

        if (count !== 0 && count === supplyRequest.supplies.length) {
          supplyRequest.status = SUPPLY_REQUEST_STATUS_ENUM.COMPLETED;
        }
        await supplyRequest.save();
      }
    }

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async countSupplyByJob(
    request: DetailSupplyRequestRequest,
  ): Promise<ResponsePayload<any>> {
    const supplyRequests =
      await this.supplyRequestRepository.findAllByCondition({
        jobId: request.id,
      });

    const supplyCountMap = new Map();
    supplyRequests.forEach((supplyRequest) => {
      supplyRequest.supplies.forEach((supply) => {
        supplyCountMap.set(
          supply.supplyId.toString(),
          plus(
            supplyCountMap.get(supply.supplyId.toString()) || 0,
            supply.actualImportQuantity,
          ),
        );
      });
    });

    const items = [];
    supplyCountMap.forEach((value, key) => {
      items.push({
        supplyId: key,
        actualImportQuantity: value,
      });
    });

    return new ResponseBuilder({
      items,
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async update(request: UpdateSupplyRequest): Promise<any> {
    const { id, supplies, receiveExpectedDate, description, name, user } =
      request;
    const suppyRequests: any =
      await this.supplyRequestRepository.findAllWithPopulate(
        { _id: id },
        {
          path: 'deviceAssignmentId',
          populate: {
            path: 'deviceId',
            model: 'Device',
          },
        },
      );
    if (!suppyRequests) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    const suppyRequest = suppyRequests[0];

    if (moment(receiveExpectedDate).isBefore(moment(), 'day')) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.RECEIVE_EXPECTED_DATE_INVALID'),
        )
        .build();
    }

    try {
      const historyMessage = await this.i18n.translate(
        'text.supplyRequestUpdate',
      );
      await this.supplyRequestRepository.findByIdAndUpdate(id, {
        description,
        receiveExpectedDate,
        supplies,
        name,
        $push: {
          histories: {
            userId: user.id,
            action: HistoryActionEnum.UPDATE,
            content: historyMessage.replace('{username}', user.username),
            status: suppyRequest.status,
            createdAt: new Date(),
          },
        },
      });
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (err) {
      console.log(err);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('success.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  async getHistory(request: GetHistorySupplyRequestRequest): Promise<any> {
    const { id } = request;
    const supplyRequest = await this.supplyRequestRepository.findOneById(id);
    const histories = supplyRequest.histories;
    const userId = uniq(map(histories, 'userId')).filter((id) => id);
    const user = (await this.userService.listUserByIds(userId))?.data;
    const userNormalize = keyBy(user, 'id');
    const data = histories.map((history) => ({
      createdAt: history.createdAt,
      user: userNormalize[history.userId],
      status: history.status,
      action: history.action,
      content: history.content,
    }));
    const res = plainToInstance(GetHistorySupplyResponse, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(res)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }
}
