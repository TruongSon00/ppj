import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { DeviceServiceInterface } from '@components/device/interface/device.service.interface';
import { DeviceRepositoryInterface } from '@components/device/interface/device.repository.interface';
import { plainToInstance } from 'class-transformer';
import { PagingResponse } from '@utils/paging.response';
import { HistoryActionEnum } from '@components/history/history.constant';
import { CreateDeviceRequestDto } from '@components/device/dto/request/create-device.request.dto';
import { ListDevicesAppResponseDto } from '@components/device/dto/response/list-devices.app.response.dto';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { GetListDevicesRequestDto } from '@components/device/dto/request/list-devices.request.dto';
import { HistoryServiceInterface } from '@components/history/interface/history.service.interface';
import { ScanQrDeviceRequestDto } from '@components/device/dto/request/scan-qr-device.request.dto';
import {
  DeviceAssignmentDto,
  DeviceCommonInfoResponseDto,
  DeviceUsageDto,
  FactoryResponseDto,
} from '@components/device/dto/response/device-detail/device-common-info-response.dto';
import { ResponsePayload } from '@utils/response-payload';
import { ConfirmDeviceRequestDto } from '@components/device/dto/request/confirm-device.request.dto';
import { DeviceDetailInfoAppResponseDto } from '@components/device/dto/response/device-detail/device-detail-info-app.response.dto';
import { SupplyRepositoryInterface } from '@components/supply/interface/supply.repository.interface';
import { SupplyTypeConstant } from '@components/supply/supply.constant';
import {
  AccessoriesMaintenanceInformationDto,
  CheckListTemplateResponse,
  DetailDeviceWebResponseDto,
  DeviceSupplyDto,
  SupplyDto,
} from '@components/device/dto/response/detail-device.web.response.dto';
import { MaintenanceAttributeServiceInterface } from '@components/maintenance-attribute/interface/maintenance-attribute.service.interface';
import { MaintenanceTeamServiceInterface } from '@components/maintenance-team/interface/maintenance-team.service.interface';
import { SupplyServiceInterface } from '@components/supply/interface/supply.service.interface';
import { UpdateDeviceRequestDto } from '@components/device/dto/request/update-device.request.dto';
import {
  DeviceStatus,
  DeviceType,
  DEVICE_CONST,
  DEVICE_DETAIL_HEADER,
  DEVICE_HEADER,
  DEVICE_NAME,
  IMPORT_DEVICE_CONST,
  ResponsibleSubjectType,
} from '@components/device/device.constant';
import { DeviceMaintenanceInfoAppResponse } from '@components/device/dto/response/device-detail/device-maintenance-info-app.response.dto';
import { MaintenanceAttributeRepositoryInterface } from '@components/maintenance-attribute/interface/maintenance-attribute.repository.interface';
import { ListJobByDeviceRequestDto } from '@components/job/dto/request/list-job-by-device.request.dto';
import { JobRepositoryInterface } from '@components/job/interface/job.repository.interface';
import { flatMap, isEmpty } from 'lodash';
import { ScanJobByDeviceResponse } from '@components/job/dto/response/list-job-by-device.response.dto';
import { Device } from 'src/models/device/device.model';
import { DEPARTMENT_PERMISSION_SETTING_CAN_SEE } from '@utils/permissions/department-permission-setting';
import { GetMaintainInfoByDeviceRequest } from './dto/request/get-maintain-info-by-device.request.dto';
import { ApiError } from '@utils/api.error';
import { GetMaintainInfoByDeviceResponse } from './dto/response/get-maintain-info-by-device.response.dto';
import { plus } from '@utils/common';
import { DeviceAssignmentRepositoryInterface } from '@components/device-assignment/interface/device-assignment.repository.interface';
import { MaintenanceTeamRepositoryInterface } from '@components/maintenance-team/interface/maintenance-team.repository.interface';
import { ProduceServiceInterface } from '@components/produce/interface/produce.service.interface';
import { DeviceRequestTicketRepositoryInterface } from '@components/device-request/interface/device-request-ticket.repository.interface';
import { MaintainRequestRepositoryInterface } from '@components/maintain-request/interface/maintain-request.repository.interface';
import { GetAllConstant } from '@components/maintenance-attribute/maintenance-attribute.constant';
import { MaintenanceHistoryResponseDto } from '@components/device/dto/response/device-detail/maintenance-history.response.dto';
import { ExportDeviceRequestDto } from '@components/device/dto/request/export-device.request.dto';
import { CsvWriter } from '@core/csv/csv.writer';
import { DeviceGroupRepositoryInterface } from '@components/device-group/interface/device-group.repository.interface';
import { DeleteDeviceRequestDto } from './dto/request/delete-device.request.dto';
import { JOB_STATUS_ENUM } from '@components/job/job.constant';
import { AssignTypeEnum } from 'src/models/device-assignment/device-assignment.schema';
import {
  DEFAULT_DEVICE_UNIT_CODE,
  DEFAULT_ITEM_GROUP_CODE,
  DEFAULT_ITEM_TYPE_CODE,
} from '@components/item/item.constant';
import { SaleService } from '@components/sale/sale.service';
import { GetDetailDeviceAppInfoRequestDto } from './dto/request/detail-device-app-info.request.dto';
import { DeviceMaintenanceInfoAppRequestDto } from './dto/request/device-maintenance-info-app.request.dto';
import { DeviceMaintenanceHistoryAppRequestDto } from './dto/request/device-maintenance-history-app.request.dto';
import { DetailMaintenanceAttributeRequestDto } from '@components/maintenance-attribute/dto/request/detail-maintenance-attribute.request.dto';
import { DetailMaintenanceTeamRequestDto } from '@components/maintenance-team/dto/request/detail-maintenance-team.request.dto';
import { CheckListTemplateRepositoryInterface } from '@components/checklist-template/interface/checklist-template.repository.interface';
import { UnitRepositoryInterface } from '@components/unit/interface/unit.repository.interface';
import { ItemServiceInterface } from '@components/item/interface/item.service.interface';

@Injectable()
export class DeviceService implements DeviceServiceInterface {
  constructor(
    @Inject('DeviceRepositoryInterface')
    private readonly deviceRepository: DeviceRepositoryInterface,

    @Inject('HistoryServiceInterface')
    private readonly historyService: HistoryServiceInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,

    @Inject('SupplyRepositoryInterface')
    private readonly supplyRepository: SupplyRepositoryInterface,

    @Inject('SupplyServiceInterface')
    private readonly supplyService: SupplyServiceInterface,

    @Inject('ItemServiceInterface')
    private readonly itemService: ItemServiceInterface,

    @Inject('UnitRepositoryInterface')
    private readonly unitRepository: UnitRepositoryInterface,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceServiceInterface,

    @Inject('MaintenanceAttributeServiceInterface')
    private readonly maintenanceAttributeService: MaintenanceAttributeServiceInterface,

    @Inject('MaintenanceTeamServiceInterface')
    private readonly maintenanceTeamService: MaintenanceTeamServiceInterface,

    @Inject('MaintenanceAttributeRepositoryInterface')
    private readonly maintenanceAttributeRepository: MaintenanceAttributeRepositoryInterface,

    @Inject('DeviceAssignmentRepositoryInterface')
    private readonly deviceAssignmentRepository: DeviceAssignmentRepositoryInterface,

    @Inject('JobRepositoryInterface')
    private readonly jobRepository: JobRepositoryInterface,

    @Inject('MaintenanceTeamRepositoryInterface')
    private readonly maintenanceTeamRepository: MaintenanceTeamRepositoryInterface,

    @Inject('DeviceRequestTicketRepositoryInterface')
    private readonly deviceRequestTicketRepository: DeviceRequestTicketRepositoryInterface,

    @Inject('MaintainRequestRepositoryInterface')
    private readonly maintainRequestRepository: MaintainRequestRepositoryInterface,

    @Inject('DeviceGroupRepositoryInterface')
    private readonly deviceGroupRepository: DeviceGroupRepositoryInterface,

    @Inject('CheckListTemplateRepositoryInterface')
    private readonly checkListTemplateRepository: CheckListTemplateRepositoryInterface,

    @Inject('SaleServiceInterface')
    private readonly saleService: SaleService,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async create(
    request: CreateDeviceRequestDto,
  ): Promise<ResponsePayload<unknown>> {
    try {
      const { code, userId } = request;
      const deviceCode = this.setDeviceCode(code, false);
      request.code = deviceCode;
      const existedCode = await this.deviceRepository.findOneByCode(deviceCode);
      const itemByCode = await this.itemService.detailItem(code);

      if (existedCode || (itemByCode && itemByCode.code === deviceCode))
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.DEVICE_CODE_EXISTED'))
          .build();

      const vendor = await this.saleService.getVendorDetail(request.vendor);
      if (!vendor) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(await this.i18n.translate('error.VENDOR_NOT_FOUND'))
          .build();
      }

      const checklistTemplate =
        await this.checkListTemplateRepository.findOneById(
          request.checkListTemplateId,
        );

      if (!checklistTemplate) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(
            await this.i18n.translate('error.CHECK_LIST_TEMPLATE_NOT_FOUND'),
          )
          .build();
      }

      // create a device and assign to history
      const device = this.deviceRepository.createDocument(request);

      device.histories.push({
        userId: userId,
        action: HistoryActionEnum.CREATE,
        createdAt: new Date(),
      });

      await device.save();

      const itemGroup = await this.itemService.detailItemGroupSetting(
        DEFAULT_ITEM_GROUP_CODE,
      );

      if (!itemGroup) {
        await this.deviceRepository.deleteById(device.id);
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      const itemType = await this.itemService.detailItemTypeSetting(
        DEFAULT_ITEM_TYPE_CODE.DEVICE,
      );

      if (!itemType) {
        await this.deviceRepository.deleteById(device.id);
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      const itemUnit = await this.itemService.detailItemUnitSetting(
        DEFAULT_DEVICE_UNIT_CODE,
      );

      if (!itemUnit) {
        await this.deviceRepository.deleteById(device.id);
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      const item = await this.itemService.createItem(
        device.code,
        device.name,
        device.description,
        itemUnit.id,
        itemType.id,
        itemGroup.id,
        request.userId,
        request.price,
      );

      if (item.statusCode !== ResponseCodeEnum.SUCCESS) {
        await this.deviceRepository.deleteById(device.id);
        return new ResponseBuilder()
          .withCode(item.statusCode)
          .withMessage(item.message)
          .build();
      }

      return new ResponseBuilder(device.id)
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    } catch (err) {
      console.log(err);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_CREATE'))
        .build();
    }
  }

  async getDetailWeb(
    id: string,
  ): Promise<ResponsePayload<DetailDeviceWebResponseDto>> {
    const device = await this.deviceRepository.detail(id);

    if (!device) {
      return new ResponseBuilder<DetailDeviceWebResponseDto>()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    const vendor = await this.saleService.getVendorDetail(
      device.information.vendor,
    );
    await this.historyService.mapUserHistory(device.histories);

    const information = device.information;

    const checkListTemplate =
      await this.checkListTemplateRepository.findOneById(
        device.checkListTemplateId,
      );
    const checkListTemplatePlain = plainToInstance(
      CheckListTemplateResponse,
      checkListTemplate,
      { excludeExtraneousValues: true },
    );

    const result: DetailDeviceWebResponseDto = {
      id: device.id,
      code: device.code,
      name: device.name,
      description: device.description,
      model: device.model,
      status: device.status,
      type: device.type,
      price: device.price,
      attributeType: device.attributeType,
      installTemplate: device.installTemplate,
      canRepair: device.canRepair,
      periodicInspectionTime: device.periodicInspectionTime,
      responsibleSubject: null,
      maintenanceAttribute: null,
      maintenancePeriod: information.maintenancePeriod,
      deviceGroup: device.deviceGroup,
      frequency: device.frequency,
      vendor: vendor,
      checkListTemplate: checkListTemplatePlain,
      brand: information.brand,
      importDate: information.importDate,
      productionDate: information.productionDate,
      warrantyPeriod: information.warrantyPeriod,
      mttrIndex: information.mttrIndex,
      mttfIndex: null,
      mttaIndex: information.mttaIndex,
      mtbfIndex: null,
      accessoriesMaintenanceInformation: null,
      suppliesAndAccessories: null,
      histories: device.histories,
    };

    const deviceSupplies = information.supplies;
    let getResponsibleInfoTask;
    const responsibleUserId = device.responsibleUserId;
    const responsibleMaintenanceTeamId = device.responsibleMaintenanceTeamId;

    if (responsibleUserId)
      getResponsibleInfoTask = this.userService.getUserById(responsibleUserId);
    else if (responsibleMaintenanceTeamId)
      getResponsibleInfoTask = this.maintenanceTeamService.detail({
        id: responsibleMaintenanceTeamId,
      } as DetailMaintenanceTeamRequestDto);

    const getDeviceMaintenanceAttrTask =
      this.maintenanceAttributeService.detail({
        id: information.maintenanceAttributeId,
      } as DetailMaintenanceAttributeRequestDto);

    const getSupplyDetailsTasks = [];

    for (const deviceSupply of deviceSupplies) {
      getSupplyDetailsTasks.push(
        this.supplyService.detail(deviceSupply.supplyId.toString()),
      );
    }

    const [
      responsibleInfoResponse,
      deviceMaintenanceAttrResponse,
      supplyDetailsResponses,
    ] = await Promise.all([
      getResponsibleInfoTask,
      getDeviceMaintenanceAttrTask,
      Promise.all(getSupplyDetailsTasks),
    ]);

    if (!isEmpty(responsibleInfoResponse))
      if (responsibleUserId)
        result.responsibleSubject = {
          id: responsibleInfoResponse.id,
          name: responsibleInfoResponse.username,
          type: ResponsibleSubjectType.User,
        };
      else if (responsibleMaintenanceTeamId) {
        const responsibleMaintenanceTeam = responsibleInfoResponse.data;

        if (responsibleMaintenanceTeam)
          result.responsibleSubject = {
            id: responsibleMaintenanceTeam.id,
            name: responsibleMaintenanceTeam.name,
            type: ResponsibleSubjectType.MaintenanceTeam,
          };
      }

    if (!isEmpty(deviceMaintenanceAttrResponse)) {
      const deviceMaintenanceAttr = deviceMaintenanceAttrResponse.data;

      if (deviceMaintenanceAttr)
        result.maintenanceAttribute = {
          id: deviceMaintenanceAttr.id,
          name: deviceMaintenanceAttr.name,
        };
    }

    if (information?.mttfIndex) {
      result.mttfIndex = {
        indexValue: information.mttfIndex,
        indexValueExchange: information.mttfIndex * device.frequency,
        maintenanceAttribute: result.maintenanceAttribute?.name,
      };
    }

    if (information?.mtbfIndex) {
      result.mtbfIndex = {
        indexValue: information.mtbfIndex,
        indexValueExchange: information.mtbfIndex * device.frequency,
        maintenanceAttribute: result.maintenanceAttribute?.name,
      };
    }

    if (!isEmpty(supplyDetailsResponses)) {
      const suppliesAndAccessories: DeviceSupplyDto[] = [];
      const accessoriesMaintenanceInformationDto: AccessoriesMaintenanceInformationDto[] =
        [];

      for (let i = 0; i < supplyDetailsResponses.length; i++) {
        const supplyDetailResponseData = supplyDetailsResponses[i].data;

        if (!isEmpty(supplyDetailResponseData)) {
          const deviceSupply = deviceSupplies[i];
          const supply: SupplyDto = {
            id: supplyDetailResponseData.id,
            name: supplyDetailResponseData.name,
            type: supplyDetailResponseData.type,
          };

          const deviceSupplyResponse: DeviceSupplyDto = {
            supply: supply,
            quantity: deviceSupply.quantity,
            useDate: deviceSupply.useDate,
            canRepair: deviceSupply.canRepair,
          };

          suppliesAndAccessories.push(deviceSupplyResponse);

          const supplyInfo = deviceSupplyResponse.supply;

          if (supplyInfo.type === SupplyTypeConstant.ACCESSORY) {
            const accessoryMaintenanceInfo: AccessoriesMaintenanceInformationDto =
              {
                supply: supply,
                maintenancePeriod: deviceSupply.maintenancePeriod,
                mttrIndex: deviceSupply.mttrIndex,
                mttfIndex: {
                  indexValue: deviceSupply.mttfIndex,
                  indexValueExchange: deviceSupply.mttfIndex * device.frequency,
                  maintenanceAttribute: result.maintenanceAttribute.name,
                },
                mttaIndex: deviceSupply.mttaIndex,
                mtbfIndex: {
                  indexValue: deviceSupply.mtbfIndex,
                  indexValueExchange: deviceSupply.mtbfIndex * device.frequency,
                  maintenanceAttribute: result.maintenanceAttribute.name,
                },
              };

            accessoriesMaintenanceInformationDto.push(accessoryMaintenanceInfo);
          }
        }
      }

      result.suppliesAndAccessories = suppliesAndAccessories;
      result.accessoriesMaintenanceInformation =
        accessoriesMaintenanceInformationDto;
    }

    return new ResponseBuilder<DetailDeviceWebResponseDto>(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async getList(
    request: GetListDevicesRequestDto,
  ): Promise<ResponsePayload<PagingResponse>> {
    const { result, count } = await this.deviceRepository.getList(request);

    return new ResponseBuilder<PagingResponse>({
      items: result,
      meta: { total: count, page: request.page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async update(
    request: UpdateDeviceRequestDto,
  ): Promise<ResponsePayload<unknown>> {
    const { id, code, name, userId } = request;

    const checkUnconfirmedDevice = await this.checkUnconfirmedDevice(id);

    if (checkUnconfirmedDevice) return checkUnconfirmedDevice;

    const existedCode = await this.deviceRepository.findExistedByCondition(id, {
      code,
    });

    if (existedCode)
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.DEVICE_CODE_EXISTED'))
        .build();

    const vendor = await this.saleService.getVendorDetail(request.vendor);
    if (!vendor) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.VENDOR_NOT_FOUND'))
        .build();
    }

    const checklistTemplate =
      await this.checkListTemplateRepository.findOneById(
        request.checkListTemplateId,
      );

    if (!checklistTemplate) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(
          await this.i18n.translate('error.CHECK_LIST_TEMPLATE_NOT_FOUND'),
        )
        .build();
    }

    try {
      await this.deviceRepository.update(request, {
        userId: userId,
        action: HistoryActionEnum.UPDATE,
        createdAt: new Date(),
      });

      const itemGroup = await this.itemService.detailItemGroupSetting(
        DEFAULT_ITEM_GROUP_CODE,
      );
      if (!itemGroup) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      const itemType = await this.itemService.detailItemTypeSetting(
        DEFAULT_ITEM_TYPE_CODE.DEVICE,
      );
      if (!itemType) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      const itemUnit = await this.itemService.detailItemUnitSetting(
        DEFAULT_DEVICE_UNIT_CODE,
      );
      if (!itemUnit) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      const item = await this.itemService.detailItem(code);
      if (!item) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      const itemUpdate = await this.itemService.update(
        item.id,
        code,
        name,
        request.description,
        itemUnit.id,
        itemType.id,
        itemGroup.id,
        request.userId,
        request.price,
      );

      if (itemUpdate.statusCode !== ResponseCodeEnum.SUCCESS) {
        return new ResponseBuilder()
          .withCode(itemUpdate.statusCode)
          .withMessage(itemUpdate.message)
          .build();
      }

      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_UPDATE'))
        .build();
    }
  }

  async getListApp(request: GetListDevicesRequestDto): Promise<any> {
    let checkPermission = false;
    const user = await this.userService.detailUser(request.user.id);
    request.user = user.data;
    request.user.departmentSettings.forEach((department) => {
      if (DEPARTMENT_PERMISSION_SETTING_CAN_SEE.includes(department.id)) {
        checkPermission = true;
      }
    });

    const [result, count] = await this.deviceAssignmentRepository.getListForApp(
      request,
      checkPermission,
    );

    const userIds = result.map((e) => e.deviceRequestId.userId);
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
    let responsibleUserInfo;
    if (parseInt(request.isGetAll) == GetAllConstant.YES) {
      for (const e of result) {
        if (e.assign.type === AssignTypeEnum.TEAM) {
          responsibleUserInfo = await this.maintenanceTeamRepository.detail(
            e.assign.id,
          );
          e.responsibleUser = {
            id: responsibleUserInfo._id.toString(),
            code: responsibleUserInfo.code,
            name: responsibleUserInfo.name,
            type: ResponsibleSubjectType.MaintenanceTeam,
          };
        } else if (e.assign.type === AssignTypeEnum.USER) {
          responsibleUserInfo = await this.userService.getUserById(
            Number(e.assign.id),
          );
          e.responsibleUser = {
            id: responsibleUserInfo.id,
            name: responsibleUserInfo.username,
            type: ResponsibleSubjectType.User,
          };
        } else e.responsibleUser = null;
      }
    }
    const response: ListDevicesAppResponseDto[] = result.map((e) => {
      return {
        deviceAssignId: e._id,
        id: e?.deviceRequestId?.device?._id,
        code: e?.deviceRequestId?.device?.code,
        name: e?.deviceRequestId?.device?.name,
        serial: e.serial,
        assignmentUser: {
          fullName: userMap.get(e?.deviceRequestId?.userId)?.fullName,
          id: e?.deviceRequestId?.userId,
          phone: userMap.get(e?.deviceRequestId?.userId)?.phone,
          username: userMap.get(e?.deviceRequestId?.userId)?.username,
          factory: workCenterMap.get(e.deviceRequestId.workCenterId)?.factory
            ?.name,
          workCenter: workCenterMap.get(e.deviceRequestId.workCenterId)?.name,
        },
        estimatedMaintenance: plus(
          e?.mttaIndex ||
            e?.deviceRequestId?.device?.information?.mttaIndex ||
            0,
          e?.mttrIndex ||
            e?.deviceRequestId?.device?.information?.mttrIndex ||
            0,
        ),
        responsibleUser: e.responsibleUser,
        type: e?.deviceRequestId?.device?.type,
      };
    });

    return new ResponseBuilder<PagingResponse>({
      items: response,
      meta: { total: count, page: request.page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async scanQrCode(request: ScanQrDeviceRequestDto): Promise<any> {
    const { qrCode, userId } = request;
    try {
      const deviceAssign =
        await this.deviceAssignmentRepository.getDeviceAssignmentBySerial(
          qrCode,
        );
      if (!deviceAssign) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.DEVICE_ASSIGNMENT_NOT_FOUND'),
          )
          .build();
      }
      const deviceRequest =
        await this.deviceRequestTicketRepository.findOneById(
          deviceAssign.deviceRequestId,
        );
      if (!deviceRequest) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.DEVICE_REQUEST_TICKET_NOT_FOUND'),
          )
          .build();
      }
      // @TODO: check this
      const response = undefined;
      // await this.deviceRepository.findOneBySerial(
      //   deviceRequest.device,
      // );
      // find responsible user

      let responsibleUserInfo;
      if (response.responsibleMaintenanceTeamId) {
        responsibleUserInfo = await this.maintenanceTeamRepository.detail(
          response.responsibleMaintenanceTeamId,
        );
        response.responsibleUser = {
          id: responsibleUserInfo._id.toString(),
          name: responsibleUserInfo.name,
          type: ResponsibleSubjectType.MaintenanceTeam,
        };
      } else if (response.responsibleUserId) {
        responsibleUserInfo = await this.userService.getUserById(
          response.responsibleUserId,
        );
        response.responsibleUser = {
          id: responsibleUserInfo.id,
          name: responsibleUserInfo.username,
          type: ResponsibleSubjectType.User,
        };
      }

      if (deviceAssign.factoryId) {
        const factoryDetail = await this.userService.detailFactory(
          deviceAssign.factoryId,
        );
        if (!isEmpty(factoryDetail.data)) {
          const factoryAssignment = new FactoryResponseDto();
          factoryAssignment.id = factoryDetail.data.id;
          factoryAssignment.code = factoryDetail.data.code;
          factoryAssignment.name = factoryDetail.data.name;
          response.factory = factoryAssignment;
        } else response.factory = null;
      } else response.factory = null;
      // TODO mock device assignment (serial, date)
      const deviceAssignment = new DeviceAssignmentDto();
      deviceAssignment.id = deviceAssign._id.toString();
      deviceAssignment.serial = deviceAssign.serial;
      deviceAssignment.date = new Date();

      response.deviceAssignment = deviceAssignment;

      // TODO mock device usage (user, date)
      const usageUser = await this.userService.getUserById(deviceAssign.userId);
      let deviceUsage = new DeviceUsageDto();
      deviceUsage.date = new Date();
      if (!isEmpty(usageUser)) {
        deviceUsage.id = usageUser.id;
        deviceUsage.username = usageUser.username;
        deviceUsage.fullName = usageUser.fullName;
      } else {
        deviceUsage = null;
      }
      response.workCenter = null;
      if (deviceAssign.workCenterId) {
        const workCenter = await this.produceService.getDetailWorkCenter(
          deviceAssign.workCenterId,
        );
        response.workCenter = {
          id: workCenter?.id,
          code: workCenter?.code,
          name: workCenter?.name,
        };
      }
      response.oee = deviceAssign?.oee;
      response.productivityTarget = deviceAssign?.productivityTarget;
      response.assignmentUser = deviceUsage;
      response.estimatedMaintenance = response.information.maintenancePeriod;

      const result = plainToInstance(DeviceCommonInfoResponseDto, response, {
        excludeExtraneousValues: true,
      });

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withData(result)
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
  }

  async confirm(
    request: ConfirmDeviceRequestDto,
  ): Promise<ResponsePayload<unknown>> {
    const { id, userId } = request;

    const [updatedDeviceId, notFoundMsg] = await Promise.all([
      this.deviceRepository.confirm(id, {
        userId: userId,
        action: HistoryActionEnum.CONFIRM,
        createdAt: new Date(),
      }),
      this.i18n.translate('error.DEVICE_NOT_FOUND'),
    ]);

    if (updatedDeviceId)
      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.BAD_REQUEST)
      .withMessage(notFoundMsg.toString())
      .build();
  }

  async delete(
    request: DeleteDeviceRequestDto,
  ): Promise<ResponsePayload<unknown>> {
    const checkUnconfirmedDevice = await this.checkUnconfirmedDevice(
      request.id,
    );

    if (checkUnconfirmedDevice) return checkUnconfirmedDevice;

    const device = await this.deviceRepository.findOneById(request.id);

    const item = await this.itemService.detailItem(device.code);

    if (!item || item.code !== device.code) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    const itemDelete = await this.itemService.deleteItem(
      item.id,
      request.userId,
    );

    if (itemDelete.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ResponseBuilder()
        .withCode(itemDelete.code || ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(itemDelete.message)
        .build();
    }

    const deletedDevice = await this.deviceRepository.delete(request.id);

    if (deletedDevice)
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
      .withMessage(await this.i18n.translate('error.CAN_NOT_DELETE'))
      .build();
  }

  async getDetailApp(request: GetDetailDeviceAppInfoRequestDto): Promise<any> {
    const { id } = request;
    const response = await this.deviceRepository.detailApp(id);
    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    const vendor = await this.saleService.getVendorDetail(
      response.information.vendor,
    );
    // find list of supplies and accessories
    const suppliesIds = [];
    const suppliesListRaw = [];
    let suppliesRes = [];
    let accessoriesRes = [];
    if (!isEmpty(response.information?.supplies)) {
      response.information?.supplies.forEach((item) => {
        if (!suppliesIds.includes(item.supplyId)) {
          suppliesIds.push(item.supplyId);
          suppliesListRaw.push({
            supplyId: item.supplyId,
            quantity: item.quantity,
            useDate: item.useDate,
          });
        }
      });
      const supplies = await this.supplyRepository.findAllByCondition({
        _id: { $in: suppliesIds },
      });
      // map Item unit to Supplies
      await this.mapItemUnitToSupplies(supplies);
      // divide all supplies to accessories or supplies
      const dividedData = await this.divideSuppliesAndAccessories(
        suppliesIds,
        suppliesListRaw,
      );
      suppliesRes = dividedData[0];
      accessoriesRes = dividedData[1];
    }
    response.supplies = suppliesRes;
    response.accessories = accessoriesRes;
    response.information.vendor = vendor?.name || '';
    await this.historyService.sortHistoryDesc(response.histories);
    const result = plainToInstance(DeviceDetailInfoAppResponseDto, response, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  private async mapItemUnitToSupplies(supplies: any): Promise<void> {
    const itemUnitIds = [];
    if (!isEmpty(supplies)) {
      supplies.forEach((item) => {
        if (!itemUnitIds.includes(item.itemUnitId)) {
          itemUnitIds.push(item.itemUnitId);
        }
      });
      const itemUnits = await this.unitRepository.findAllByCondition({
        _id: {
          $in: itemUnitIds,
        },
      });
      if (!isEmpty(itemUnits)) {
        const itemRaws = {};
        itemUnits.forEach((item) => {
          itemRaws[item._id] = item.name;
        });
        supplies.forEach((item) => {
          item.unit = itemRaws[item.itemUnitId];
        });
      }
    }
  }

  private async checkUnconfirmedDevice(
    id: string,
  ): Promise<ResponsePayload<unknown>> {
    const device = await this.deviceRepository.findOneById(id);

    if (!device)
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.DEVICE_NOT_FOUND'))
        .build();

    if (device.status == DeviceStatus.Confirmed)
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.DEVICE_USED'))
        .build();

    return null;
  }

  async getMaintenanceInfoApp(
    request: DeviceMaintenanceInfoAppRequestDto,
  ): Promise<any> {
    const { serial } = request;
    const deviceAssignment =
      await this.deviceAssignmentRepository.findOneByCondition({
        serial: serial,
      });
    if (!deviceAssignment) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.DEVICE_ASSIGNMENT_NOT_FOUND'),
        )
        .build();
    }
    const deviceRequest = await this.deviceRequestTicketRepository.findOneById(
      deviceAssignment.deviceRequestId,
    );
    if (!deviceRequest) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.DEVICE_ASSIGNMENT_NOT_FOUND'),
        )
        .build();
    }
    // @TODO: check this
    const device = undefined;
    // await this.deviceRepository.findOneBySerial(
    //   deviceRequest.device,
    // );
    if (!device) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.DEVICE_NOT_FOUND'))
        .build();
    }
    const maintenanceAttribute =
      await this.maintenanceAttributeRepository.detail(
        device.information?.maintenanceAttributeId,
      );
    if (!maintenanceAttribute) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.DEVICE_NOT_FOUND'))
        .build();
    }
    const supplyIds = device.information.supplies.map((e) => e.supplyId) || [];
    const supplies = await this.supplyRepository.findAllByCondition({
      _id: {
        $in: supplyIds,
      },
    });

    const supplyMap = new Map();
    supplies.forEach((e) => {
      supplyMap.set(e._id.toString(), e);
    });

    const deviceSupplyMap = new Map();
    deviceAssignment.information?.supplies.forEach((e) => {
      deviceSupplyMap.set(e.supplyId.toString(), e);
    });

    // Map data to response
    const result: DeviceMaintenanceInfoAppResponse =
      new DeviceMaintenanceInfoAppResponse();
    result.code = device.code;
    result.name = device.name;
    result.estMaintenanceDate = deviceAssignment.information?.estMaintenceDate;
    result.estReplaceDate = deviceAssignment.information?.estReplaceDate;
    result.mtbfIndex = {
      indexValue: device.information?.mtbfIndex,
      indexValueExchange: device.information?.mtbfIndex * device.frequency,
      maintenanceAttribute: maintenanceAttribute.name,
    };
    result.mttaIndex = device.information?.mttaIndex;
    result.mttfIndex = {
      indexValue: device.information?.mttfIndex,
      indexValueExchange: device.information?.mttfIndex * device.frequency,
      maintenanceAttribute: maintenanceAttribute.name,
    };
    result.mttrIndex = device.information?.mttrIndex;
    result.supplies = device.information?.supplies.map((e) => ({
      code: supplyMap.get(e.supplyId.toString())?.code,
      name: supplyMap.get(e.supplyId.toString())?.name,
      estMaintenanceDate: deviceSupplyMap.get(e.supplyId.toString())
        ?.estMaintenceDate,
      estReplaceDate: deviceSupplyMap.get(e.supplyId.toString())
        ?.estReplaceDate,
      mtbfIndex: {
        indexValue: e.mtbfIndex,
        indexValueExchange: e.mtbfIndex * device.frequency,
        maintenanceAttribute: maintenanceAttribute.name,
      },
      mttaIndex: e.mttaIndex,
      mttfIndex: {
        indexValue: e.mttfIndex,
        indexValueExchange: e.mttfIndex * device.frequency,
        maintenanceAttribute: maintenanceAttribute.name,
      },
      mttrIndex: e.mttrIndex,
    }));
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(result)
      .build();
  }

  private async divideSuppliesAndAccessories(
    suppliesIds: number[],
    suppliesListRaw: any[],
  ): Promise<any> {
    const accessoriesRes = [];
    const suppliesRes = [];
    const supplies = await this.supplyRepository.findAllByCondition({
      _id: { $in: suppliesIds },
    });
    const supplyRaws = {};
    if (!isEmpty(supplies)) {
      supplies.forEach((item) => {
        supplyRaws[item._id] = item;
      });
    }
    suppliesListRaw.forEach((item) => {
      const supply = supplyRaws[item.supplyId];
      const res = {
        ...item,
        supply: supply,
      };
      switch (supply?.type) {
        case SupplyTypeConstant.SUPPLY:
          suppliesRes.push(res);
          break;
        case SupplyTypeConstant.ACCESSORY:
          accessoriesRes.push(res);
          break;
        default:
          break;
      }
    });
    return await Promise.all([suppliesRes, accessoriesRes]);
  }

  async listJobByDevice(params: ListJobByDeviceRequestDto): Promise<any> {
    const { skip, total, data } = await this.jobRepository.listJobByDevice(
      params,
    );
    const dataReturn = plainToInstance(ScanJobByDeviceResponse, data, {
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

  async getAll(): Promise<ResponsePayload<Device[]>> {
    const devices = await this.deviceRepository.getAll();

    return new ResponseBuilder(devices).build();
  }

  async findOneById(id: string): Promise<ResponsePayload<Device>> {
    const device = await this.deviceRepository.findOneById(id);

    if (!device) {
      return new ResponseBuilder<Device>()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }

    return new ResponseBuilder<Device>(device)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async getMaintainInfoByDevice(
    request: GetMaintainInfoByDeviceRequest,
  ): Promise<ResponsePayload<any>> {
    const device = await this.deviceRepository.findOneById(request.id);

    if (!device) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    let deviceAssignment;
    if (!isEmpty(request.deviceAssignId)) {
      deviceAssignment = await this.deviceAssignmentRepository.findOneById(
        request.deviceAssignId,
      );
    }

    const supplyIds = device.information.supplies.map((e) => e.supplyId) || [];
    const supplies = await this.supplyRepository.findAllByCondition({
      _id: {
        $in: supplyIds,
      },
    });

    const supplyMap = new Map();
    supplies.forEach((e) => {
      supplyMap.set(e._id.toString(), e);
    });

    const deviceSupplyMap = new Map();
    deviceAssignment?.information?.supplies?.forEach((e) => {
      deviceSupplyMap.set(e.supplyId, e);
    });

    // Map data to response
    const result: GetMaintainInfoByDeviceResponse =
      new GetMaintainInfoByDeviceResponse();

    result.name = device.name;
    result.estMaintenceDate = deviceAssignment?.information?.estMaintenceDate;
    result.estReplaceDate = deviceAssignment?.information?.estReplaceDate;
    result.maintenancePeriod = device.information?.maintenancePeriod || 0;
    result.mtbfIndex =
      deviceAssignment?.mtbfIndex || device.information?.mtbfIndex;
    result.mttaIndex =
      deviceAssignment?.mttaIndex || device.information?.mttaIndex;
    result.mttfIndex =
      deviceAssignment?.mttfIndex || device.information?.mttfIndex;
    result.mttrIndex =
      deviceAssignment?.mttrIndex || device.information?.mttrIndex;

    result.details = device.information?.supplies.map((e) => {
      const supplyId = e.supplyId.toString();
      return {
        name: supplyMap.get(supplyId)?.name,
        estMaintenceDate: deviceSupplyMap.get(e.supplyId)?.estMaintenceDate,
        estReplaceDate: deviceSupplyMap.get(e.supplyId)?.estReplaceDate,
        maintenancePeriod: e.maintenancePeriod || 0,
        mtbfIndex: deviceSupplyMap.get(supplyId)?.mtbfIndex || e.mtbfIndex,
        mttaIndex: deviceSupplyMap.get(supplyId)?.mttaIndex || e.mttaIndex,
        mttfIndex: deviceSupplyMap.get(supplyId)?.mttfIndex || e.mttfIndex,
        mttrIndex: deviceSupplyMap.get(supplyId)?.mttrIndex || e.mttrIndex,
        type: supplyMap.get(supplyId)?.type,
      };
    });

    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async getMaintenanceHistoryApp(
    request: DeviceMaintenanceHistoryAppRequestDto,
  ): Promise<any> {
    const { serial } = request;
    const deviceAssignment =
      await this.deviceAssignmentRepository.getDeviceAssignmentBySerial(serial);

    if (!deviceAssignment) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.DEVICE_ASSIGNMENT_NOT_FOUND'),
        )
        .build();
    }

    const params = new ListJobByDeviceRequestDto();
    params.userId = 1;
    params.serial = deviceAssignment.serial;
    const { data } = await this.jobRepository.listJobByDevice(
      params,
      JOB_STATUS_ENUM.RESOLVED,
    );

    if (!data) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.JOB_NOT_FOUND'))
        .build();
    }
    for (const e of data) {
      const maintenanceRequest =
        await this.maintainRequestRepository.findOneById(e?.jobTypeId);
      if (maintenanceRequest) e.maintenanceTypes = maintenanceRequest.type;
      else e.maintenanceTypes = null;
    }
    data.forEach((e) => {
      if (!isEmpty(e.warning[0])) e.name = e.warning[0]?.name;
      else if (!isEmpty(e.maintenancePeriodWarning[0]))
        e.name = e.maintenancePeriodWarning[0]?.name;
      else if (!isEmpty(e.maintainRequest[0]))
        e.name = e.maintainRequest[0].name;
      else e.name = null;
    });
    const response = plainToInstance(MaintenanceHistoryResponseDto, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async exportDevice(request: ExportDeviceRequestDto): Promise<any> {
    const devices = await this.deviceRepository.getListDeviceByIds(
      request._ids,
    );
    if (!devices) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.DEVICE_NOT_FOUND'))
        .build();
    }
    let responsibleUsers;
    for (const e of devices) {
      const deviceGroup = await this.deviceGroupRepository.findOneById(
        e.deviceGroup,
      );
      e.deviceGroupName = deviceGroup?.name;
      const maintenanceAttribute =
        await this.maintenanceAttributeRepository.detail(
          e.information?.maintenanceAttribute,
        );
      e.maintenanceAttribute = maintenanceAttribute?.name;
      if (e.responsibleMaintenanceTeam != null) {
        responsibleUsers = await this.maintenanceTeamRepository.detail(
          e.responsibleMaintenanceTeam,
        );
        e.responsibleUser = responsibleUsers.name;
      } else if (e.responsibleUserIds != null) {
        responsibleUsers = await this.userService.getUserById(
          e.responsibleUserIds,
        );
        e.responsibleUser = responsibleUsers.username;
      } else {
        e.responsibleUser = null;
      }
    }

    const responseDetail = devices.reduce((x, y) => {
      for (const e of y.information.supplies) {
        x.push({
          code: y.code ? y.code : '',
          supply: e.supplyId ? e.supplyId : '',
          quantity: e.quantity ? e.quantity : 0,
          useDate: e.useDate ? e.useDate : 0,
          maintenancePeriod: e.information?.maintenancePeriod
            ? e.information?.maintenancePeriod
            : 0,
          mttaIndex: e.information?.mttaIndex ? e.information?.mttaIndex : 0,
          mttrIndex: e.information?.mttrIndex ? e.information?.mttrIndex : 0,
          mtbfIndex: e.information?.mtbfIndex
            ? e.information?.mtbfIndex +
              ' ~ ' +
              e.information.mtbfIndex * e.frequency
            : 0,
          mttfIndex: e.information?.mttfIndex
            ? e.information?.mttfIndex +
              ' ~ ' +
              e.information.mttfIndex * e.frequency
            : 0,
        });
      }
      return x;
    }, []);

    const responseRef = devices.reduce((x, y) => {
      x.push({
        _id: y._id ? y._id.toString() : '',
        code: y.code ? y.code : '',
        name: y.name ? y.name : '',
        description: y.description ? y.description : '',
        status: y.status ? y.status : 0,
        model: y.model ? y.model : '',
        periodicInspectionTime: y.periodicInspectionTime
          ? y.periodicInspectionTime
          : '',
        frequency: y.frequency ? y.frequency : 0,
        price: y.price ? y.price : 0,
        deviceGroupName: y.deviceGroupName ? y.deviceGroupName : '',
        type: y.type ? y.type : 0,
        maintenanceAttribute: y.maintenanceAttribute
          ? y.maintenanceAttribute
          : 0,
        vendor: y.information?.vendor ? y.information?.vendor : '',
        brand: y.information?.brand ? y.information?.brand : '',
        importDate: y.information?.importDate ? y.information?.importDate : '',
        productionDate: y.information?.productionDate
          ? y.information?.productionDate
          : '',
        warrantyPeriod: y.information?.warrantyPeriod
          ? y.information?.warrantyPeriod
          : '',
        maintenancePeriod: y.information?.maintenancePeriod
          ? y.information?.maintenancePeriod
          : '',
        mttaIndex: y.information?.mttaIndex ? y.information?.mttaIndex : 0,
        mttrIndex: y.information?.mttrIndex ? y.information?.mttrIndex : 0,
        mtbfIndex: y.information?.mtbfIndex
          ? y.information?.mtbfIndex +
            ' ~ ' +
            y.information.mtbfIndex * y.frequency
          : 0,
        mttfIndex: y.information?.mttfIndex
          ? y.information?.mttfIndex +
            ' ~ ' +
            y.information.mttfIndex * y.frequency
          : 0,
        createdAt: y.createdAt
          ? y.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, '')
          : new Date(),
        updatedAt: y.updatedAt
          ? y.updatedAt.toISOString().replace(/T/, ' ').replace(/\..+/, '')
          : new Date(),
        responsibleUser: y.responsibleUser ? y.responsibleUser : '',
      });
      return x;
    }, []);
    for (const e of responseDetail) {
      const supply = await this.supplyRepository.findOneById(e.supply);
      if (supply) {
        e.supplyCode = supply?.code;
        e.supplyName = supply?.name;
        e.supplyType = supply?.type;
      }
    }
    const csvWriter = new CsvWriter();
    csvWriter.name = DEVICE_NAME;
    csvWriter.mapHeader = DEVICE_HEADER;
    csvWriter.i18n = this.i18n;

    const csvWriterDetail = new CsvWriter();
    csvWriterDetail.name = DEVICE_NAME;
    csvWriterDetail.mapHeader = DEVICE_DETAIL_HEADER;
    csvWriterDetail.i18n = this.i18n;
    let index = 0;
    const dataCsv = responseRef.map((i) => {
      index++;
      return {
        i: index,
        _id: i._id,
        code: i.code,
        name: i.name,
        description: i.description,
        status: i.status,
        model: i.model,
        periodicInspectionTime: i.periodicInspectionTime,
        frequency: i.frequency,
        price: i.price,
        deviceGroupName: i.deviceGroupName,
        type: i.type,
        maintenanceAttribute: i.maintenanceAttribute,
        vendor: i.vendor,
        brand: i.brand,
        importDate: i.importDate,
        productionDate: i.productionDate,
        warrantyPeriod: i.warrantyPeriod,
        maintenancePeriod: i.maintenancePeriod,
        mttaIndex: i.mttaIndex,
        mttrIndex: i.mttrIndex,
        mtbfIndex: i.mtbfIndex,
        mttfIndex: i.mttfIndex,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
        responsibleUser: i.responsibleUser,
      };
    });
    const dataDetailCsv = responseDetail.map((i) => {
      index++;
      return {
        i: index,
        code: i.code,
        supply: i.supplyName,
        supplyType: i.supplyType,
        quantity: i.quantity,
        useDate: i.useDate,
        maintenancePeriod: i.maintenancePeriod,
        mttaIndex: i.mttaIndex,
        mttrIndex: i.mttrIndex,
        mtbfIndex: i.mtbfIndex,
        mttfIndex: i.mttfIndex,
      };
    });
    return new ResponseBuilder<any>({
      file: await csvWriter.writeCsv(dataCsv),
      fileDetail: await csvWriterDetail.writeCsv(dataDetailCsv),
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .build();
  }

  async findOneByCode(code: string): Promise<ResponsePayload<Device>> {
    const device = await this.deviceRepository.findOneByCode(code);

    if (!device)
      return new ResponseBuilder<Device>()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();

    return new ResponseBuilder<Device>()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withData(device)
      .build();
  }

  async updateDeviceIndex(deviceId: string) {
    const deviceAssignments =
      await this.deviceAssignmentRepository.findAllByCondition({
        deviceId,
      });
    const device = await this.deviceRepository.findOneById(deviceId);
    const maintainRequestHistories = flatMap(
      deviceAssignments,
      'maintainRequestHistories',
    );
    //@TODO: check lại logic update chỉ số của vtpt
    // const deviceSupplyHistories = flatMap(
    //   maintainRequestHistories,
    //   'supplyHistories',
    // );
    const sumOfField = (items, props) => {
      return items.reduce(
        (pre, cur) =>
          cur[props]
            ? { value: +pre.value + +cur[props], count: pre.count + 1 }
            : pre,
        { value: 0, count: 0 },
      );
    };
    const totalMttf = sumOfField(maintainRequestHistories, 'mttfIndex');
    const mttfIndex =
      totalMttf.count > 0
        ? totalMttf.value / totalMttf.count
        : device.information?.mttfIndex;
    const totalMtbf = sumOfField(maintainRequestHistories, 'mtbfIndex');
    const mtbfIndex =
      totalMtbf.count > 0
        ? totalMtbf.value / totalMtbf.count
        : device.information?.mtbfIndex;
    const totalMttr = sumOfField(maintainRequestHistories, 'mttrIndex');
    const mttrIndex =
      totalMttr.count > 0
        ? totalMttr.value / totalMttr.count
        : device.information?.mttrIndex;
    const totalMtta = sumOfField(maintainRequestHistories, 'mttaIndex');
    const mttaIndex =
      totalMtta.count > 0
        ? totalMtta.value / totalMtta.count
        : device.information?.mttaIndex;
    //@TODO: check lại logic update chỉ số của vtpt
    // device.information.supplies = device?.information?.supplies?.map(
    //   (deviceSupply) => {
    //     const supplyHistories = deviceSupplyHistories.filter(
    //       (supplyHistory) =>
    //         supplyHistory.supplyId.toString() ===
    //         deviceSupply.supplyId.toString(),
    //     );
    //     const totalUsageTimeToMaintenance = sumOfField(
    //       supplyHistories,
    //       'usageTimeToMaintenance',
    //     );
    //     const supplyMtbfIndex =
    //       totalUsageTimeToMaintenance.count > 0
    //         ? totalUsageTimeToMaintenance.value /
    //           totalUsageTimeToMaintenance.count
    //         : deviceSupply?.mtbfIndex;
    //     const totalUsageTimToReplace = sumOfField(
    //       supplyHistories,
    //       'usageTimeToReplace',
    //     );
    //     const supplyMttfIndex =
    //       totalUsageTimToReplace.count > 0
    //         ? totalUsageTimToReplace.value / totalUsageTimToReplace.count
    //         : deviceSupply?.mttfIndex;
    //     const totalConfirmationTime = sumOfField(
    //       supplyHistories,
    //       'confirmationTime',
    //     );
    //     const supplyMttaIndex =
    //       totalConfirmationTime.count > 0
    //         ? totalConfirmationTime.value / totalConfirmationTime.count
    //         : deviceSupply.mttaIndex;
    //     const totalRepairTime = sumOfField(supplyHistories, 'repairTime');
    //     const supplyMttrIndex =
    //       totalRepairTime.count > 0
    //         ? totalRepairTime.value / totalRepairTime.count
    //         : deviceSupply.mttaIndex;
    //     return {
    //       ...deviceSupply,
    //       mttrIndex: supplyMttrIndex,
    //       mttaIndex: supplyMttaIndex,
    //       mtbfIndex: supplyMtbfIndex,
    //       mttfIndex: supplyMttfIndex,
    //     };
    //   },
    // );

    await this.deviceRepository.findByIdAndUpdate(deviceId, {
      information: {
        ...device.information,
        mttaIndex,
        mttrIndex,
        mtbfIndex,
        mttfIndex,
      },
    });
  }

  setDeviceCode(code: string, isUpdate = false) {
    return !isUpdate
      ? `${DEVICE_CONST.CODE.PRE_FIX}${code.padStart(
          DEVICE_CONST.CODE.MAX_LENGTH - DEVICE_CONST.CODE.PRE_FIX.length,
          DEVICE_CONST.CODE.PAD_CHAR,
        )}`
      : code;
  }
}
