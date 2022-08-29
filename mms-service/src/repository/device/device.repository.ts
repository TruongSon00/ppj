import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { DeviceRepositoryInterface } from '@components/device/interface/device.repository.interface';
import {
  Device,
  DeviceInformation,
  DeviceSupply,
} from '../../models/device/device.model';
import { filter, isEmpty } from 'lodash';
import { GetListDevicesRequestDto } from '@components/device/dto/request/list-devices.request.dto';
import { CreateDeviceRequestDto } from '@components/device/dto/request/create-device.request.dto';
import {
  DeviceStatus,
  DEVICE_CONST,
  ResponsibleSubjectType,
} from '@components/device/device.constant';
import { History } from 'src/models/history/history.model';
import { DEVICE_GROUP_CONST } from '@components/device-group/device-group.constant';
import { UpdateDeviceRequestDto } from '@components/device/dto/request/update-device.request.dto';
import '@utils/extensions/mongoose.extension';
import '@utils/extensions/string.extension';
import { ListReportDeviceStatusQuery } from '@components/report-device-status/dto/query/list-report-device-status.query';
import { convertOrderMongo } from '@utils/common';
import {
  BASE_ENTITY_CONST,
  DOCUMENT_CONST,
  FieldVisibility,
  SortOrder,
} from '@constant/database.constant';
import { findByIdAndPopulateHistory } from '@utils/extensions/mongoose.extension';
import * as moment from 'moment';

@Injectable()
export class DeviceRepository
  extends BaseAbstractRepository<Device>
  implements DeviceRepositoryInterface
{
  constructor(
    @InjectModel('Device')
    private readonly deviceModel: Model<Device>,
  ) {
    super(deviceModel);
  }

  createDocument(request: CreateDeviceRequestDto): Device {
    const device = new this.deviceModel();

    return this.updateDocument(device, request);
  }

  updateDocument(
    device: Device & { _id: any },
    request: CreateDeviceRequestDto | UpdateDeviceRequestDto,
  ): Device & { _id: any } {
    const {
      deviceGroupId,
      maintenanceAttributeId,
      maintenancePeriod,
      mtbfIndex,
      mttaIndex,
      mttfIndex,
      mttrIndex,
      brand,
      accessoriesMaintenanceInformation,
      importDate,
      productionDate,
      vendor,
      warrantyPeriod,
      suppliesAndAccessories,
      code,
      frequency,
      periodicInspectionTime,
      price,
      responsibleSubject,
      model,
      name,
      description,
      type,
      attributeType,
      installTemplate,
      canRepair,
      checkListTemplateId,
    } = request;

    device.code = code;
    device.name = name;
    device.model = model;
    device.description = description;
    device.frequency = frequency;
    device.deviceGroup = new Types.ObjectId(deviceGroupId);
    device.type = type;
    device.periodicInspectionTime = periodicInspectionTime;
    device.price = price;
    device.attributeType = attributeType;
    device.canRepair = canRepair;
    device.installTemplate = installTemplate;
    device.checkListTemplateId = checkListTemplateId;

    const responsibleSubjectType = responsibleSubject.type;

    // TODO: build a validation decorator for responsible maintenanceTeamId and userId
    if (responsibleSubjectType == ResponsibleSubjectType.MaintenanceTeam) {
      device.responsibleMaintenanceTeamId = responsibleSubject.id as string;
    } else if (responsibleSubjectType == ResponsibleSubjectType.User) {
      device.responsibleUserId = responsibleSubject.id as number;
    }

    device.information = new DeviceInformation();

    const information = device.information;

    information.vendor = vendor;
    information.brand = brand;
    information.importDate = importDate;
    information.productionDate = productionDate;
    information.warrantyPeriod = warrantyPeriod;
    information.maintenanceAttributeId = maintenanceAttributeId;
    information.mttaIndex = mttaIndex;
    information.mttfIndex = mttfIndex;
    information.mtbfIndex = mtbfIndex;
    information.maintenancePeriod = maintenancePeriod;
    information.mttrIndex = mttrIndex;

    if (isEmpty(suppliesAndAccessories)) return device;

    const deviceSupplies: DeviceSupply[] = [];

    suppliesAndAccessories.forEach((requestSupply) => {
      const deviceSupply = new DeviceSupply();

      deviceSupply.supplyId = requestSupply.supplyId;
      deviceSupply.quantity = requestSupply.quantity;
      deviceSupply.useDate = requestSupply.useDate;
      deviceSupply.canRepair = requestSupply.canRepair;

      const accessoryMaintenanceInformation =
        accessoriesMaintenanceInformation.find(
          (accessory) => accessory.supplyId == deviceSupply.supplyId,
        );

      if (accessoryMaintenanceInformation) {
        deviceSupply.maintenancePeriod =
          accessoryMaintenanceInformation.maintenancePeriod;
        deviceSupply.mttrIndex = accessoryMaintenanceInformation.mttrIndex;
        deviceSupply.mttaIndex = accessoryMaintenanceInformation.mttaIndex;
        deviceSupply.mttfIndex = accessoryMaintenanceInformation.mttfIndex;
        deviceSupply.mtbfIndex = accessoryMaintenanceInformation.mtbfIndex;
      }

      deviceSupplies.push(deviceSupply);
    });

    device.information.supplies = deviceSupplies;

    return device;
  }

  async detail(id: string): Promise<Device> {
    const findQuery = findByIdAndPopulateHistory(this.deviceModel, id);

    const queryResult = await findQuery
      .lookup({
        from: 'deviceGroups',
        localField: 'deviceGroup',
        foreignField: '_id',
        as: 'deviceGroup',
        pipeline: [
          {
            $project: {
              id: DOCUMENT_CONST.ID_PATH,
              _id: FieldVisibility.Hidden,
              code: FieldVisibility.Visible,
              name: FieldVisibility.Visible,
            },
          },
        ],
      })
      .unwind({
        path: '$deviceGroup',
        preserveNullAndEmptyArrays: true,
      })
      .exec();

    return queryResult[0];
  }

  async findOneByCode(code: string): Promise<Device & { _id: any }> {
    return await this.deviceModel.findOne({ code: code }).exec();
  }

  async findDeviceByIds(id: string[]): Promise<any> {
    return await this.deviceModel.find({ id: id }).exec();
  }

  async getList(request: GetListDevicesRequestDto): Promise<any> {
    const { keyword, sort, filter, take, skip } = request;

    let filterObj = {};
    let sortObj = {};

    if (!isEmpty(keyword)) {
      filterObj['$or'] = [
        { code: { $regex: '.*' + keyword + '.*', $options: 'i' } },
        { name: { $regex: '.*' + keyword + '.*', $options: 'i' } },
      ];
    }

    const codeColumn = DEVICE_CONST.CODE.COLUMN;
    const nameColumn = DEVICE_CONST.NAME.COLUMN;
    const descriptionColumn = DEVICE_CONST.DESCRIPTION.COLUMN;
    const deviceGroupColumn = DEVICE_CONST.DEVICE_GROUP.COLUMN;
    const deviceGroupIdColumn = DEVICE_CONST.DEVICE_GROUP_ID.COLUMN;
    const statusColumn = DEVICE_CONST.STATUS.COLUMN;

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        const text = item.text;

        switch (item.column) {
          case codeColumn:
            filterObj = {
              ...filterObj,
              $and: [
                {
                  code: {
                    $regex: '.*' + text + '.*',
                    $options: 'i',
                  },
                },
              ],
            };
            break;
          case nameColumn:
            filterObj = {
              ...filterObj,
              $and: [
                {
                  name: {
                    $regex: '.*' + text + '.*',
                    $options: 'i',
                  },
                },
              ],
            };
            break;
          case descriptionColumn:
            if (isEmpty(text))
              filterObj = {
                ...filterObj,
                description: { $in: [null, ''] },
              };
            else
              filterObj = {
                ...filterObj,
                description: {
                  $regex: '.*' + text + '.*',
                  $options: 'i',
                },
              };
            break;
          case deviceGroupColumn:
            filterObj = {
              ...filterObj,
              'deviceGroup.name': {
                $regex: '.*' + text + '.*',
                $options: 'i',
              },
            };
            break;
          case deviceGroupIdColumn:
            filterObj = {
              ...filterObj,
              'deviceGroup._id': new Types.ObjectId(text),
            };
            break;
          case statusColumn:
            filterObj = {
              ...filterObj,
              status: parseInt(text),
            };
            break;
          case 'createdAt':
            filterObj = {
              ...filterObj,
              createdAt: {
                $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                $lte: moment(item.text.split('|')[1]).endOf('day').toDate(),
              },
            };
            break;
          case 'updatedAt':
            filterObj = {
              ...filterObj,
              updatedAt: {
                $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                $lte: moment(item.text.split('|')[1]).endOf('day').toDate(),
              },
            };
            break;
          default:
            break;
        }
      });
    }

    const query = this.deviceModel
      .aggregate()
      .lookup({
        from: DEVICE_GROUP_CONST.COLL,
        localField: deviceGroupColumn,
        foreignField: DEVICE_GROUP_CONST.ID.COLUMN,
        as: deviceGroupColumn,
      })
      .unwind({
        path: `$${deviceGroupColumn}`,
        preserveNullAndEmptyArrays: true,
      })
      .match(filterObj);

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        const order = item.order?.toSortOrder();

        switch (item.column) {
          case codeColumn:
            sortObj = { code: order };
            break;
          case nameColumn:
            sortObj = { name: order };
            break;
          case descriptionColumn:
            sortObj = { description: order };
            break;
          case deviceGroupColumn:
            sortObj = { 'deviceGroup.name': order };
            break;
          case statusColumn:
            sortObj = { status: order };
            break;
          case BASE_ENTITY_CONST.CREATED_AT.COLUMN:
            sortObj = { createdAt: order };
            break;
          case BASE_ENTITY_CONST.UPDATED_AT.COLUMN:
            sortObj = { updatedAt: order };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: SortOrder.Descending };
    }

    const queryResult = (
      await query
        .project({
          id: DOCUMENT_CONST.ID_PATH,
          _id: FieldVisibility.Hidden,
          code: FieldVisibility.Visible,
          name: FieldVisibility.Visible,
          description: FieldVisibility.Visible,
          status: FieldVisibility.Visible,
          createdAt: FieldVisibility.Visible,
          updatedAt: FieldVisibility.Visible,
          deviceGroup: {
            id: '$deviceGroup._id',
            name: FieldVisibility.Visible,
          },
        })
        .buildPaginationQuery(skip, take, sortObj)
        .exec()
    )[0];

    return { result: queryResult.data, count: queryResult.total };
  }

  async getListExport(request: GetListDevicesRequestDto): Promise<any[]> {
    const { keyword, sort, filter, take, skip } = request;

    let filterObj = {};
    let sortObj = {};
    let keywordObj = {};

    if (!isEmpty(keyword)) {
      keywordObj = [
        { code: { $regex: '.*' + keyword + '.*', $options: 'i' } },
        { name: { $regex: '.*' + keyword + '.*', $options: 'i' } },
      ];
    }

    const codeColumn = DEVICE_CONST.CODE.COLUMN;
    const nameColumn = DEVICE_CONST.NAME.COLUMN;
    const descriptionColumn = DEVICE_CONST.DESCRIPTION.COLUMN;
    const deviceGroupColumn = DEVICE_CONST.DEVICE_GROUP.COLUMN;
    const deviceGroupIdColumn = DEVICE_CONST.DEVICE_GROUP_ID.COLUMN;
    const statusColumn = DEVICE_CONST.STATUS.COLUMN;

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        const text = item.text;

        switch (item.column) {
          case codeColumn:
            filterObj = {
              ...filterObj,
              code: {
                $regex: '.*' + text + '.*',
                $options: 'i',
              },
            };
            break;
          case nameColumn:
            filterObj = {
              ...filterObj,
              name: {
                $regex: '.*' + text + '.*',
                $options: 'i',
              },
            };
            break;
          case deviceGroupColumn:
            filterObj = {
              ...filterObj,
              'deviceGroup.name': {
                $regex: '.*' + text + '.*',
                $options: 'i',
              },
            };
            break;
          case deviceGroupIdColumn:
            filterObj = {
              ...filterObj,
              'deviceGroup._id': new Types.ObjectId(text),
            };
            break;
          case statusColumn:
            filterObj = {
              ...filterObj,
              status: parseInt(text),
            };
            break;
          case 'createdAt':
            filterObj = {
              ...filterObj,
              createdAt: {
                $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                $lte: moment(item.text.split('|')[1]).endOf('day').toDate(),
              },
            };
            break;
          case 'updatedAt':
            filterObj = {
              ...filterObj,
              updatedAt: {
                $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                $lte: moment(item.text.split('|')[1]).endOf('day').toDate(),
              },
            };
            break;
          default:
            break;
        }
      });
    }

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        const order = item.order?.toSortOrder();

        switch (item.column) {
          case codeColumn:
            sortObj = { code: order };
            break;
          case nameColumn:
            sortObj = { name: order };
            break;
          case descriptionColumn:
            sortObj = { description: order };
            break;
          case deviceGroupColumn:
            sortObj = { 'deviceGroup.name': order };
            break;
          case statusColumn:
            sortObj = { status: order };
            break;
          case BASE_ENTITY_CONST.CREATED_AT.COLUMN:
            sortObj = { createdAt: order };
            break;
          case BASE_ENTITY_CONST.UPDATED_AT.COLUMN:
            sortObj = { updatedAt: order };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: SortOrder.Descending };
    }

    return this.deviceModel
      .find(keywordObj)
      .find(filterObj)
      .sort(sortObj)
      .populate({
        path: `deviceGroup attributeType installTemplate checkListTemplateId responsibleMaintenanceTeamId information.maintenanceAttributeId information.supplies.supplyId`,
      })
      .skip(skip)
      .limit(take)
      .exec();
  }

  async update(
    request: UpdateDeviceRequestDto,
    history: History,
  ): Promise<Device> {
    const { id, responsibleSubject } = request;

    let device = await this.deviceModel.findById(id);

    device = this.updateDocument(device, request);

    const responsibleSubjectType = responsibleSubject.type;

    if (responsibleSubjectType == ResponsibleSubjectType.User)
      device.responsibleMaintenanceTeamId = null;
    else if (responsibleSubjectType == ResponsibleSubjectType.MaintenanceTeam)
      device.responsibleUserId = null;

    device.histories.push(history);

    return await device.save();
  }

  async findOneBySerial(qrCode: Types.ObjectId): Promise<any> {
    // TODO: mock find device by id instead of serial number
    const result = await this.deviceModel
      .findOne({
        _id: qrCode,
      })
      .exec();
    return result;
  }

  async confirm(id: string, history: History): Promise<string> {
    const device = await this.deviceModel
      .findOne({
        _id: new Types.ObjectId(id),
        status: DeviceStatus.AwaitingConfirmation,
      })
      .exec();

    if (!device) return null;

    device.status = DeviceStatus.Confirmed;
    device.histories.push(history);
    await device.save();

    return device.id;
  }

  async delete(id: string): Promise<Device> {
    const device = await this.deviceModel
      .findOne({
        _id: new Types.ObjectId(id),
      })
      .exec();

    if (!device) return null;

    return device.remove();
  }

  async detailApp(id: string): Promise<any> {
    const result = await this.deviceModel
      .findById(id)
      .populate('information')
      .populate('deviceGroup')
      .exec();
    return result;
  }

  async findExistedByCondition(
    id: string,
    condition: FilterQuery<Device & { _id: any }>,
  ): Promise<Device> {
    return await this.deviceModel
      .where('_id')
      .ne(new Types.ObjectId(id))
      .findOne(condition)
      .exec();
  }

  async findOneById(id: string): Promise<Device> {
    return await this.deviceModel.findById(new Types.ObjectId(id)).exec();
  }

  async getAll(): Promise<Device[]> {
    return await this.deviceModel
      .find({
        status: DeviceStatus.Confirmed,
      })
      .select('code name type')
      .exec();
  }

  async getDeviceBySupply(supplyId: string): Promise<any> {
    const result = await this.deviceModel
      .findOne({
        $and: [{ 'information.supplies.supplyId': supplyId }],
      })
      .exec();
    return result;
  }

  async findMaintenanceTeam(id: string): Promise<any> {
    return await this.deviceModel
      .findOne({ responsibleMaintenanceTeamId: id })
      .exec();
  }

  getListForApp(
    request: GetListDevicesRequestDto,
    checkPermission: boolean,
  ): Promise<any> {
    const { keyword, take, skip, user } = request;
    let filterObj = {};
    let permission = {};

    if (!isEmpty(keyword)) {
      filterObj = {
        $or: [
          { serial: { $regex: '.*' + keyword + '.*', $options: 'i' } },
          {
            code: {
              $regex: '.*' + keyword + '.*',
              $options: 'i',
            },
          },
          {
            name: {
              $regex: '.*' + keyword + '.*',
              $options: 'i',
            },
          },
        ],
      };
    }

    if (!checkPermission) permission = { userId: user.id };

    filterObj = {
      ...filterObj,
      ...permission,
    };

    const query = this.deviceModel.find(filterObj);

    if (request.isGetAll == '1') {
      return Promise.all([
        query.exec(),
        this.deviceModel.estimatedDocumentCount().exec(),
      ]);
    } else {
      return Promise.all([
        query
          .skip(skip)
          .limit(take)
          .sort({
            createdAt: -1,
          })
          .exec(),
        this.deviceModel.estimatedDocumentCount().exec(),
      ]);
    }
  }

  async getManufacturingInfo(request: any): Promise<any> {
    const { take, skip, dateFrom, dateTo } = request;
    const result = await this.deviceModel
      .find({
        created_at: {
          $gte: dateFrom,
          $lt: dateTo,
        },
      })
      .limit(take)
      .skip(skip)
      .exec();
    const total = result.length;
    return { result: result, count: total };
  }

  async getListReportDeviceStatus(
    request: ListReportDeviceStatusQuery,
  ): Promise<{ result: any[]; count: number }> {
    let filterObj = {};
    let sortObj = {};
    let keywordObj = {};
    let deviceGroup = {};
    let factory = {};
    let workCenter = {};

    if (request.deviceGroupId !== null && request.deviceGroupId !== undefined) {
      deviceGroup = {
        deviceGroup: new Types.ObjectId(request.deviceGroupId),
      };
    }
    if (request.factoryId !== null && request.factoryId !== undefined) {
      factory = {
        factoryId: request.factoryId,
      };
    }
    if (request.workCenterId !== null && request.workCenterId !== undefined) {
      workCenter = {
        workCenterId: request.workCenterId,
      };
    }

    if (!isEmpty(request.keyword)) {
      keywordObj = {
        $or: [
          { code: { $regex: '.*' + request.keyword + '.*', $options: 'i' } },
          { name: { $regex: '.*' + request.keyword + '.*', $options: 'i' } },
        ],
      };
    }

    if (!isEmpty(request.filter)) {
      request.filter.forEach((item) => {
        switch (item.column) {
          case 'devideCode':
            filterObj = {
              code: { $regex: '.*' + item.text + '.*', $options: 'i' },
            };
            break;
          case 'devideName':
            filterObj = {
              name: { $regex: '.*' + item.text + '.*', $options: 'i' },
            };
            break;
          case 'name':
            filterObj = {
              name: { $regex: '.*' + item.text + '.*', $options: 'i' },
            };
            break;
          case 'status':
            filterObj = {
              ...filter,
              status: +item.text,
            };
          default:
            break;
        }
      });
    }

    if (!isEmpty(request.sort)) {
      request.sort.forEach((item) => {
        switch (item.column) {
          case 'code':
            sortObj = { code: convertOrderMongo(item.order) };
            break;
          case 'name':
            sortObj = { name: convertOrderMongo(item.order) };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: -1 };
    }

    const result = await this.deviceModel.aggregate([
      {
        $lookup: {
          from: 'deviceAssignments',
          localField: '_id',
          foreignField: 'deviceId',
          as: 'deviceAssignments',
          pipeline: [
            {
              $project: {
                _id: 1,
                status: 1,
              },
            },
            {
              $group: {
                _id: {
                  status: '$status',
                  _id: '$_id',
                },
                count: { $count: {} },
              },
            },
          ],
        },
      },
      {
        $match: {
          ...keywordObj,
          ...filterObj,
          ...deviceGroup,
          ...workCenter,
          ...factory,
        },
      },
      {
        $sort: sortObj,
      },
      {
        $facet: {
          paginatedResults: [{ $skip: request.skip }, { $limit: request.take }],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ]);
    return {
      result: result[0].paginatedResults,
      count: result[0]?.totalCount[0]?.count || 0,
    };
  }

  async getListDeviceByIds(ids: string[]): Promise<any> {
    return await this.deviceModel.find({ _id: { $in: ids } });
  }

  async findMaintenanceAttributeExist(id: string): Promise<any> {
    const result = await this.deviceModel
      .findOne({
        $and: [{ 'information.maintenanceAttributeId': id }],
      })
      .exec();
    return result;
  }
}
