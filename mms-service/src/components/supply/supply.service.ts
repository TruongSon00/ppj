import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { UserService } from '@components/user/user.service';
import { SupplyRepositoryInterface } from '@components/supply/interface/supply.repository.interface';
import { plainToInstance } from 'class-transformer';
import { PagingResponse } from '@utils/paging.response';
import { CreateSupplyRequestDto } from '@components/supply/dto/request/create-supply.request.dto';
import { HistoryActionEnum } from '@components/history/history.constant';
import { CreateSupplyResponseDto } from '@components/supply/dto/response/create-supply.response.dto';
import { GetDetailSupplyResponseDto } from '@components/supply/dto/response/get-detail-supply.response.dto';
import { ItemService } from '@components/item/item.service';
import {
  STATUS_TO_DELETE_OR_UPDATE_SUPPLY,
  SUPPLY_HEADER,
  SUPPLY_NAME,
  SupplyStatusConstant,
  SupplyTypeConstant,
  SUPPLY_CONST,
} from '@components/supply/supply.constant';
import { UpdateSupplyRequestDto } from '@components/supply/dto/request/update-supply.request.dto';
import { ApiError } from '@utils/api.error';
import { ConfirmSupplyRequestDto } from '@components/supply/dto/request/confirm-supply.request.dto';
import { UpdateSupplyResponseDto } from '@components/supply/dto/response/update-supply.response.dto';
import { isEmpty, compact, keyBy, has, uniq, map } from 'lodash';
import { GetAllConstant } from '@components/maintenance-attribute/maintenance-attribute.constant';
import { GetListSupplyRequestDto } from '@components/supply/dto/request/get-list-supply.request.dto';
import { GetAllSupplyResponseDto } from '@components/supply/dto/response/get-all-supply.response.dto';
import { MaintenanceTeamRepositoryInterface } from '@components/maintenance-team/interface/maintenance-team.repository.interface';
import { HistoryServiceInterface } from '@components/history/interface/history.service.interface';
import { SupplyGroupRepositoryInterface } from '@components/supply-group/interface/supply-group.repository.interface';
import { ResponsibleSubjectType } from '@components/device/device.constant';
import { ExportSupplyRequestDto } from '@components/supply/dto/request/export-supply.request.dto';
import { CsvWriter } from '@core/csv/csv.writer';
import { DeleteSupplyRequestDto } from './dto/request/delete-supply.request.dto';
import {
  DEFAULT_ITEM_GROUP_CODE,
  DEFAULT_ITEM_TYPE_CODE,
} from '@components/item/item.constant';
import { SaleService } from '@components/sale/sale.service';
import { ListSupplyResponseDto } from './dto/response/list-supply.response.dto';
import { DetailUnitResponse } from '@components/unit/dto/response/detail-unit.response';
import { UnitRepositoryInterface } from '@components/unit/interface/unit.repository.interface';

@Injectable()
export class SupplyService {
  constructor(
    @Inject('SupplyRepositoryInterface')
    private readonly supplyRepository: SupplyRepositoryInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserService,

    @Inject('MaintenanceTeamRepositoryInterface')
    private readonly maintenanceTeamRepository: MaintenanceTeamRepositoryInterface,

    @Inject('ItemServiceInterface')
    private readonly itemService: ItemService,

    @Inject('SaleServiceInterface')
    private readonly saleService: SaleService,

    @Inject('SupplyGroupRepositoryInterface')
    private readonly supplyGroupRepository: SupplyGroupRepositoryInterface,

    @Inject('HistoryServiceInterface')
    private readonly historyService: HistoryServiceInterface,

    @Inject('UnitRepositoryInterface')
    private readonly unitRepository: UnitRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async create(request: CreateSupplyRequestDto): Promise<any> {
    try {
      const {
        code,
        name,
        description,
        itemUnitId,
        groupSupplyId,
        userId,
        type,
        price,
        responsibleUser,
        receivedDate,
        vendorId,
      } = request;
      const isCodeExisted = await this.supplyRepository.findOneByCondition({
        code: code,
      });
      const isItemCodeExisted = await this.itemService.detailItem(code);
      if (isCodeExisted || isItemCodeExisted)
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.SUPPLY_CODE_EXIST'))
          .build();

      let responsibleUserId = null;
      let responsibleMaintenanceTeam = null;
      if (responsibleUser) {
        if (responsibleUser.type === ResponsibleSubjectType.User) {
          responsibleUserId = responsibleUser.id;
          responsibleMaintenanceTeam = null;
        } else if (
          responsibleUser.type === ResponsibleSubjectType.MaintenanceTeam
        ) {
          responsibleMaintenanceTeam = responsibleUser.id;
          responsibleUserId = null;
        }
      }
      if (responsibleUserId != null) {
        const userInfo = await this.userService.getUserById(responsibleUserId);
        if (!userInfo) {
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
            .withMessage(await this.i18n.translate('error.USER_NOT_FOUND'))
            .build();
        }
      } else if (responsibleMaintenanceTeam != null) {
        const maintenanceTeam = await this.maintenanceTeamRepository.detail(
          responsibleMaintenanceTeam,
        );
        if (!maintenanceTeam) {
          return new ResponseBuilder()
            .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
            .withMessage(
              await this.i18n.translate('error.MAINTENANCE_TEAM_NOT_FOUND'),
            )
            .build();
        }
      }

      if (vendorId) {
        const vendor = await this.saleService.getVendorDetail(vendorId);

        if (isEmpty(vendor)) {
          return new ApiError(
            ResponseCodeEnum.NOT_FOUND,
            await this.i18n.translate('error.VENDOR_NOT_FOUND'),
          ).toResponse();
        }
      }

      const supplyDocument = this.supplyRepository.createDocument({
        code: code,
        name: name,
        responsibleUserIds: responsibleUserId,
        responsibleMaintenanceTeam: responsibleMaintenanceTeam,
        description: description,
        status: SupplyStatusConstant.AWAITING,
        itemUnitId: itemUnitId,
        groupSupplyId: groupSupplyId,
        type: type,
        price: price,
        receivedDate,
        vendorId,
      });
      const checkCodeExists = await this.supplyRepository.checkCodeExists(
        supplyDocument?.code,
      );
      if (checkCodeExists) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
          .withMessage(await this.i18n.translate('error.SUPPLY_CODE_EXIST'))
          .build();
      }
      const supply = await this.supplyRepository.create(supplyDocument);
      supply.histories.push({
        userId: userId,
        action: HistoryActionEnum.CREATE,
        createdAt: new Date(),
      });
      const response = await supply.save();
      const itemGroup = await this.itemService.detailItemGroupSetting(
        DEFAULT_ITEM_GROUP_CODE,
      );

      if (!itemGroup) {
        await this.supplyRepository.deleteById(response.id);
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      const itemTypeCode =
        SupplyTypeConstant.ACCESSORY === request.type
          ? DEFAULT_ITEM_TYPE_CODE.ACCESSORY
          : DEFAULT_ITEM_TYPE_CODE.SUPPLY;
      const itemType = await this.itemService.detailItemTypeSetting(
        itemTypeCode,
      );

      if (!itemType) {
        await this.supplyRepository.deleteById(response.id);
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      const item = await this.itemService.createItem(
        response.code,
        request.name,
        request.description,
        request.itemUnitId,
        itemType.id,
        itemGroup.id,
        request.userId,
        request.price,
      );

      if (item.statusCode !== ResponseCodeEnum.SUCCESS) {
        await this.supplyRepository.deleteById(response.id);
        return new ResponseBuilder()
          .withCode(item.statusCode)
          .withMessage(item.message)
          .build();
      }

      const result = plainToInstance(CreateSupplyResponseDto, response, {
        excludeExtraneousValues: true,
      });
      return new ResponseBuilder(result)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    }
  }

  async getList(request: GetListSupplyRequestDto): Promise<any> {
    if (parseInt(request.isGetAll) == GetAllConstant.YES) {
      const response = await this.supplyRepository.findSupplyConfirmed();
      if (!response) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.SUPPLY_NOT_FOUND'))
          .build();
      }
      let responsibleUserInfo;
      for (const e of response) {
        if (e.responsibleMaintenanceTeam) {
          responsibleUserInfo = await this.maintenanceTeamRepository.detail(
            e.responsibleMaintenanceTeam.toString(),
          );
          e.responsibleUser = {
            id: responsibleUserInfo._id.toString(),
            name: responsibleUserInfo.name,
            type: ResponsibleSubjectType.MaintenanceTeam,
          };
        } else if (e.responsibleUserIds) {
          responsibleUserInfo = await this.userService.getUserById(
            e.responsibleUserIds,
          );
          e.responsibleUser = {
            id: responsibleUserInfo.id,
            name: responsibleUserInfo.username,
            type: ResponsibleSubjectType.User,
          };
        } else e.responsibleUser = null;
      }
      const result = plainToInstance(GetAllSupplyResponseDto, response, {
        excludeExtraneousValues: true,
      });
      return new ResponseBuilder(result)
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    } else {
      const { result, count } = await this.supplyRepository.getList(request);

      const vendorIds: number[] = compact(result.map((item) => item.vendorId));

      const vendors = await this.saleService.getVendorsByIds(vendorIds);

      const vendorMap = keyBy(vendors, 'id');
      result.forEach((vendor) => {
        vendor.vendor = has(vendorMap, vendor.vendorId)
          ? vendorMap[vendor.vendorId]
          : {};
      });

      const dataReturn = plainToInstance(ListSupplyResponseDto, result, {
        excludeExtraneousValues: true,
      });

      return new ResponseBuilder<PagingResponse>({
        items: dataReturn,
        meta: { total: count, page: request.page },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    }
  }

  async detail(
    id: string,
  ): Promise<ResponsePayload<GetDetailSupplyResponseDto | any>> {
    const response = await this.supplyRepository.detail(id);
    if (!response) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.SUPPLY_NOT_FOUND'))
        .build();
    }
    const itemUnit = await this.unitRepository.findOneById(response.itemUnitId);
    response.itemUnit = plainToInstance(DetailUnitResponse, itemUnit, {
      excludeExtraneousValues: true,
    });
    response.supplyGroup = await this.supplyGroupRepository.findOneById(
      response.groupSupplyId,
    );
    let responsibleUserInfo;
    await this.historyService.mapUserHistory(response.histories);
    if (response.responsibleMaintenanceTeam) {
      responsibleUserInfo = await this.maintenanceTeamRepository.detail(
        response.responsibleMaintenanceTeam,
      );
      response.responsibleUser = {
        id: responsibleUserInfo._id.toString(),
        name: responsibleUserInfo.name,
        type: ResponsibleSubjectType.MaintenanceTeam,
      };
    } else if (response.responsibleUserIds) {
      responsibleUserInfo = await this.userService.getUserById(
        response.responsibleUserIds,
      );
      response.responsibleUser = {
        id: responsibleUserInfo.id,
        name: responsibleUserInfo.username,
        type: ResponsibleSubjectType.User,
      };
    } else response.responsibleUser = null;
    await this.historyService.sortHistoryDesc(response.histories);

    if (response.vendorId) {
      const vendor = await this.saleService.getVendorDetail(response.vendorId);
      response.vendor = vendor || {};
    }

    const result = plainToInstance(GetDetailSupplyResponseDto, response, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(result)
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }

  async update(request: UpdateSupplyRequestDto): Promise<any> {
    const { _id, userId, responsibleUser } = request;
    const supply = await this.supplyRepository.detail(_id);
    if (!supply) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.SUPPLY_NOT_FOUND'))
        .build();
    }
    if (!STATUS_TO_DELETE_OR_UPDATE_SUPPLY.includes(supply.status)) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.STATUS_CONFIRM'),
      ).toResponse();
    }
    try {
      let responsibleUserIds = null;
      let responsibleMaintenanceTeam = null;
      if (responsibleUser) {
        if (responsibleUser.type === ResponsibleSubjectType.User) {
          responsibleUserIds = responsibleUser.id;
          responsibleMaintenanceTeam = null;
        } else if (
          responsibleUser.type === ResponsibleSubjectType.MaintenanceTeam
        ) {
          responsibleMaintenanceTeam = responsibleUser.id;
          responsibleUserIds = null;
        }
      }

      if (request.vendorId) {
        const vendor = await this.saleService.getVendorDetail(request.vendorId);

        if (isEmpty(vendor)) {
          return new ApiError(
            ResponseCodeEnum.NOT_FOUND,
            await this.i18n.translate('error.VENDOR_NOT_FOUND'),
          ).toResponse();
        }
      }

      await this.supplyRepository.update({
        ...request,
        responsibleUserIds: responsibleUserIds,
        responsibleMaintenanceTeam: responsibleMaintenanceTeam,
        history: {
          userId: userId,
          action: HistoryActionEnum.UPDATE,
          createdAt: new Date(),
        },
      });
      const response = await this.supplyRepository.detail(_id);
      if (!response) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.SUPPLY_NOT_FOUND'))
          .build();
      }
      const itemUnit = await this.unitRepository.findOneById(
        response.itemUnitId,
      );
      response.itemUnit = plainToInstance(DetailUnitResponse, itemUnit, {
        excludeExtraneousValues: true,
      });
      response.supplyGroup = await this.supplyGroupRepository.findOneById(
        response.groupSupplyId,
      );

      const itemGroup = await this.itemService.detailItemGroupSetting(
        DEFAULT_ITEM_GROUP_CODE,
      );

      if (!itemGroup) {
        await this.supplyRepository.deleteById(response.id);
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      const itemTypeCode =
        SupplyTypeConstant.ACCESSORY === request.type
          ? DEFAULT_ITEM_TYPE_CODE.ACCESSORY
          : DEFAULT_ITEM_TYPE_CODE.SUPPLY;
      const itemType = await this.itemService.detailItemTypeSetting(
        itemTypeCode,
      );

      if (!itemType) {
        await this.supplyRepository.deleteById(response.id);
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      const item = await this.itemService.detailItem(supply.code);

      if (!item || item.code !== supply.code) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }

      const itemUpdate = await this.itemService.update(
        item.id,
        supply.code,
        request.name,
        request.description,
        request.itemUnitId,
        itemType.id,
        itemGroup.id,
        request.userId,
        request.price,
      );

      if (itemUpdate.statusCode !== ResponseCodeEnum.SUCCESS) {
        await this.supplyRepository.deleteById(response.id);
        return new ResponseBuilder()
          .withCode(itemUpdate.statusCode)
          .withMessage(itemUpdate.message)
          .build();
      }

      const result = plainToInstance(UpdateSupplyResponseDto, response, {
        excludeExtraneousValues: true,
      });
      return new ResponseBuilder(result)
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    } catch (err) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_UPDATE'))
        .build();
    }
  }

  async delete(request: DeleteSupplyRequestDto) {
    const supply = await this.supplyRepository.findOneById(request.id);
    if (!supply) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.SUPPLY_GROUP_NOT_FOUND'))
        .build();
    }
    if (!STATUS_TO_DELETE_OR_UPDATE_SUPPLY.includes(supply.status))
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.STATUS_CONFIRM'),
      ).toResponse();

    const item = await this.itemService.detailItem(supply.code);

    if (!item || item.code !== supply.code) {
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
    await this.supplyRepository.delete(request.id);
    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
  }

  async confirm(request: ConfirmSupplyRequestDto): Promise<any> {
    const { _id, userId } = request;
    const supplyGroup = await this.supplyRepository.findOneById(_id);
    if (!supplyGroup) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.SUPPLY_NOT_FOUND'))
        .build();
    }
    if (!STATUS_TO_DELETE_OR_UPDATE_SUPPLY.includes(supplyGroup.status))
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.STATUS_CONFIRM'),
      ).toResponse();
    try {
      // update deviceGroup
      await this.supplyRepository.update({
        ...request,
        status: SupplyStatusConstant.CONFIRMED,
        history: {
          userId: userId,
          action: HistoryActionEnum.CONFIRM,
          createdAt: new Date(),
        },
      });
      const response = await this.supplyRepository.detail(_id);
      if (!response) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.SUPPLY_NOT_FOUND'))
          .build();
      }
      return new ResponseBuilder(response)
        .withCode(ResponseCodeEnum.SUCCESS)
        .build();
    } catch (err) {
      console.log(err);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.CAN_NOT_UPDATE'))
        .build();
    }
  }

  async exportSupply(request: ExportSupplyRequestDto): Promise<any> {
    const supplies = await this.supplyRepository.getListSupplyByIds(
      request._ids,
    );
    if (!supplies) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.SUPPLY_NOT_FOUND'))
        .build();
    }
    let responsibleUsers;
    for (const e of supplies) {
      const itemUnit = await this.unitRepository.findOneById(e.itemUnitId);
      e.itemUnit = itemUnit.name;
      const supplyGroup = await this.supplyGroupRepository.findOneById(
        e.groupSupplyId,
      );
      e.supplyGroup = supplyGroup.name;
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
    const responseRef = supplies.reduce((x, y) => {
      x.push({
        _id: y._id ? y._id.toString() : '',
        code: y.code ? y.code : '',
        name: y.name ? y.name : '',
        description: y.description ? y.description : '',
        supplyGroup: y.supplyGroup ? y.supplyGroup : '',
        type: y.type ? y.type : 0,
        itemUnit: y.itemUnit ? y.itemUnit : '',
        price: y.price ? y.price : 0,
        status: y.status ? y.status : 0,
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

    const csvWriter = new CsvWriter();
    csvWriter.name = SUPPLY_NAME;
    csvWriter.mapHeader = SUPPLY_HEADER;
    csvWriter.i18n = this.i18n;
    let index = 0;
    const dataCsv = responseRef.map((i) => {
      index++;
      return {
        i: index,
        _id: i._id,
        code: i.code,
        name: i.name,
        description: i.description,
        supplyGroup: i.supplyGroup,
        type: i.type,
        itemUnit: i.itemUnit,
        price: i.price,
        status: i.status,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
        responsibleUser: i.responsibleUser,
      };
    });

    return new ResponseBuilder<any>({
      file: await csvWriter.writeCsv(dataCsv),
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .build();
  }

  setSupplyCode(code: string, isUpdate = false) {
    return !isUpdate
      ? `${SUPPLY_CONST.CODE.PRE_FIX}${code.padStart(
          SUPPLY_CONST.CODE.MAX_LENGTH - SUPPLY_CONST.CODE.PRE_FIX.length,
          SUPPLY_CONST.CODE.PAD_CHAR,
        )}`
      : code;
  }

  async createMany(
    data: any,
    userId: number,
  ): Promise<{ dataSuccess: any[]; dataError: any[] }> {
    const dataToInsert = [];
    const dataToUpdate = [];
    const codesInsert = [];
    const codesUpdate = [];
    const textAdd = await this.i18n.translate('import.common.add');

    data.forEach((item) => {
      if (item.action === textAdd) {
        dataToInsert.push(item);
        codesInsert.push(item.code);
      } else {
        dataToUpdate.push(item);
        codesUpdate.push(item.code);
      }
    });

    const supplyCodeInsertExists =
      await this.supplyRepository.findAllByCondition({
        code: { $in: codesInsert },
      });
    const supplyCodeUpdateExists =
      await this.supplyRepository.findAllByCondition({
        code: { $in: codesUpdate },
      });
    const supplyInsertMap = keyBy(supplyCodeInsertExists, 'code');
    const supplyUpdateMap = keyBy(supplyCodeUpdateExists, 'code');

    const supplyGroupCodes = uniq(map(data, 'supplyGroupCode'));
    const supplyGroups = await this.supplyGroupRepository.findAllByCondition({
      code: { $in: supplyGroupCodes },
    });
    const supplyGroupMap = keyBy(supplyGroups, 'code');

    const unitCodes = uniq(map(data, 'unitCode'));
    const units = await this.unitRepository.findAllByCondition({
      code: {
        $in: unitCodes,
      },
    });
    const unitMap = keyBy(units, 'code');

    const assigns = compact(uniq(map(data, 'assign')));
    const users = await this.userService.getUsersByUsernames(assigns);
    const userMap = keyBy(users, 'username');

    const maintenanceTeams =
      await this.maintenanceTeamRepository.findAllByCondition({
        code: { $in: assigns },
      });
    const maintenanceTeamMap = keyBy(maintenanceTeams, 'code');

    const dataError = [];
    const dataInsert = [];
    const dataUpdate = [];
    dataToInsert.forEach((item) => {
      if (
        has(supplyInsertMap, item.code) ||
        !has(unitMap, item.unitCode) ||
        !has(supplyGroupMap, item.supplyGroupCode)
      ) {
        dataError.push(item);
      } else {
        dataInsert.push(item);
      }
    });
    dataToUpdate.forEach((item) => {
      if (
        !has(supplyUpdateMap, item.code) ||
        !has(unitMap, item.unitCode) ||
        !has(supplyGroupMap, item.supplyGroupCode)
      ) {
        dataError.push(item);
      } else {
        dataUpdate.push(item);
      }
    });

    const supplyDocuments = dataInsert.map((item) => {
      const supply = this.supplyRepository.createDocument({
        code: item.code,
        name: item.name,
        type: item.type,
        itemUnitId: unitMap[item.unitCode]._id,
        groupSupplyId: supplyGroupMap[item.supplyGroupCode]._id,
        responsibleUserIds: userMap[item.assign]?.id,
        responsibleMaintenanceTeam: maintenanceTeamMap[item.assign]?._id,
        price: item.price,
        status: SupplyStatusConstant.AWAITING,
        description: item.description,
        isDeleted: false,
      });
      supply.histories.push({
        userId: userId,
        action: HistoryActionEnum.CREATE,
        createdAt: new Date(),
      });
      return supply;
    });
    const dataSuccess = await this.supplyRepository.createMany(supplyDocuments);
    const dataUpdateMap = keyBy(dataUpdate, 'code');

    await Promise.all(
      supplyCodeUpdateExists.map((supply) => {
        supply.name = dataUpdateMap[supply.code]?.name;
        supply.description = dataUpdateMap[supply.code]?.description;
        supply.type = dataUpdateMap[supply.code]?.type;
        supply.itemUnitId = unitMap[dataUpdateMap[supply.code].unitCode]._id;
        supply.groupSupplyId =
          supplyGroupMap[dataUpdateMap[supply.code].supplyGroupCode]._id;
        supply.responsibleUserIds =
          userMap[dataUpdateMap[supply.code].assign]?.id;
        supply.responsibleMaintenanceTeam =
          maintenanceTeamMap[dataUpdateMap[supply.code].assign]?._id;
        supply.price = dataUpdateMap[supply.code].price;
        supply.histories.push({
          userId: userId,
          action: HistoryActionEnum.UPDATE,
          createdAt: new Date(),
        });
        return supply.save();
      }),
    );

    return {
      dataError,
      dataSuccess: [...dataSuccess, ...supplyCodeUpdateExists],
    };
  }
}
