import { ListSerialByDeviceIds } from './../../components/device-assignment/dto/request/list-device-assignment-by-device-ids.request.dto';
import { Injectable } from '@nestjs/common';
import {
  DeviceAssignment,
  InformationDeviceAssignment,
} from 'src/models/device-assignment/device-assignment.model';
import { DeviceAssignmentRepositoryInterface } from '@components/device-assignment/interface/device-assignment.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'lodash';
import * as mongoose from 'mongoose';
import { Model, Types } from 'mongoose';
import { DashboardDeviceAssignmentRequestDto } from '@components/dashboard/dto/request/dashboard-device-assignment.request.dto';
import { DEVICE_ASIGNMENTS_STATUS_ENUM } from '@components/device-assignment/device-assignment.constant';
import { GetListDeviceAssignmentRequestDto } from '@components/device-assignment/dto/request/list-device-assignment.request.dto';
import { DeviceAssignRequestDto } from '@components/device-assignment/dto/request/device-assign.request.dto';
import { ExportDeviceAssignRequestDto } from '@components/device-assignment/dto/request/export-device-assign.dto';
import { Device } from 'src/models/device/device.model';
import * as moment from 'moment';
import { GetListDevicesRequestDto } from '@components/device/dto/request/list-devices.request.dto';
import {
  AssignTypeEnum,
  DeviceAssignStatus,
} from 'src/models/device-assignment/device-assignment.schema';
import { ListReportDeviceAssignStatusQuery } from '@components/report-device-status/dto/query/list-report-device-assign-status.query';
import { convertOrderMongo } from '@utils/common';
import { ListSerialByDeviceQuery } from '@components/device-assignment/dto/query/list-serial-by-device.query';
import { GetAllConstant } from '@components/supply/supply.constant';
import { ListDeviceStatusQuery } from '@components/device-status/dto/query/list-device-status.query';
import { DEVICE_STATUS_ENUM } from '@components/device-status/device-status.constant';
import { GetDashboardDeviceStatusRequestDto } from '@components/dashboard/dto/request/dashboard-device-status.request.dto';
import { DeviceType } from '@components/device/device.constant';

const ObjectId = mongoose.Types.ObjectId;

@Injectable()
export class DeviceAssignmentRepository
  extends BaseAbstractRepository<DeviceAssignment>
  implements DeviceAssignmentRepositoryInterface
{
  constructor(
    @InjectModel('DeviceAssignment')
    private readonly deviceAssignmentModel: Model<DeviceAssignment>,
  ) {
    super(deviceAssignmentModel);
  }

  createDocument(
    request: DeviceAssignRequestDto,
    device: Device,
    factoryId: number,
    userId: number,
    workCenterId: number,
    isMaintenanceTeam: boolean,
  ): DeviceAssignment {
    const newDeviceAssignment = new this.deviceAssignmentModel();
    newDeviceAssignment.serial = request.serial;
    newDeviceAssignment.assignedAt = request.assignedAt;
    newDeviceAssignment.usedAt = request.usedAt;
    newDeviceAssignment.deviceRequestId = request.deviceRequestId;
    newDeviceAssignment.deviceId = device._id;
    newDeviceAssignment.oee = request.oee;
    newDeviceAssignment.status = DEVICE_ASIGNMENTS_STATUS_ENUM.UN_USE;
    newDeviceAssignment.factoryId = factoryId;
    newDeviceAssignment.userId = userId;
    newDeviceAssignment.workTimeDataSource = request.workTimeDataSource;
    newDeviceAssignment.productivityTarget = request.productivityTarget;
    newDeviceAssignment.assign.type = isMaintenanceTeam
      ? AssignTypeEnum.TEAM
      : AssignTypeEnum.USER;
    newDeviceAssignment.assign.id = request.responsibleUserId;
    // newDeviceAssignment.responsibleUserId = request.responsibleUserId;
    newDeviceAssignment.workCenterId = workCenterId;

    newDeviceAssignment.information = new InformationDeviceAssignment();

    newDeviceAssignment.information.estMaintenceDate = moment(request.usedAt)
      .add(device.information.maintenancePeriod, 'm')
      .toDate();

    newDeviceAssignment.information.estReplaceDate = moment(request.usedAt)
      .add(device.information.mttfIndex, 'm')
      .toDate();
    newDeviceAssignment.information.mttrIndex = device.information.mttrIndex;
    newDeviceAssignment.information.mttaIndex = device.information.mttaIndex;
    newDeviceAssignment.information.mtbfIndex = device.information.mtbfIndex;
    newDeviceAssignment.information.mttfIndex = device.information.mttfIndex;
    newDeviceAssignment.information.supplies =
      device.information?.supplies?.map((e) => {
        return {
          supplyId: e.supplyId,
          estMaintenceDate: moment(request.usedAt)
            .add(e?.maintenancePeriod, 'm')
            .toDate(),
          estReplaceDate: moment(request.usedAt)
            .add(e?.mttfIndex, 'm')
            .toDate(),
          mttrIndex: e?.mttrIndex,
          mttaIndex: e?.mttaIndex,
          mtbfIndex: e?.mtbfIndex,
          mttfIndex: e?.mttfIndex,
        };
      });

    return newDeviceAssignment;
  }

  async dashboardDeviceAssignment(
    request: DashboardDeviceAssignmentRequestDto,
  ) {
    const { factoryId } = request;
    const facet = {
      $facet: {
        totalUnUseItem: [],
        totalInUseItem: [],
        totalMaintiningItem: [],
        totalReturnItem: [],
        totalScrappingItem: [],
      },
    } as any;
    const condition: any = { deletedAt: null };
    if (factoryId) {
      condition.factoryId = parseInt(factoryId.toString());
    }
    const query = [];
    facet.$facet.totalUnUseItem.push(
      {
        $match: {
          status: DEVICE_ASIGNMENTS_STATUS_ENUM.UN_USE,
          ...condition,
        },
      },
      {
        $count: 'count',
      },
    );
    facet.$facet.totalInUseItem.push(
      {
        $match: {
          status: DEVICE_ASIGNMENTS_STATUS_ENUM.IN_USE,
          ...condition,
        },
      },
      {
        $count: 'count',
      },
    );
    facet.$facet.totalMaintiningItem.push(
      {
        $match: {
          status: DEVICE_ASIGNMENTS_STATUS_ENUM.IN_MAINTAINING,
          ...condition,
        },
      },
      {
        $count: 'count',
      },
    );
    facet.$facet.totalReturnItem.push(
      {
        $match: {
          status: DEVICE_ASIGNMENTS_STATUS_ENUM.RETURNED,
          ...condition,
        },
      },
      {
        $count: 'count',
      },
    );
    facet.$facet.totalScrappingItem.push(
      {
        $match: {
          status: DEVICE_ASIGNMENTS_STATUS_ENUM.IN_SCRAPPING,
          ...condition,
        },
      },
      {
        $count: 'count',
      },
    );
    query.push(facet);
    const rs = await this.model.aggregate(query);
    const data = {
      totalUnUseItem: rs[0].totalUnUseItem[0]?.count || 0,
      totalInUseItem: rs[0].totalInUseItem[0]?.count || 0,
      totalMaintiningItem: rs[0].totalMaintiningItem[0]?.count || 0,
      totalReturnItem: rs[0].totalReturnItem[0]?.count || 0,
      totalScrappingItem: rs[0].totalScrappingItem[0]?.count || 0,
    };
    return data;
  }

  async getDeviceAssignmentByDevice(deviceId: string): Promise<any> {
    return await this.deviceAssignmentModel.findOne({
      $and: [{ deviceId: deviceId }],
    });
  }

  async detailDeviceAssignment(id: string): Promise<any> {
    const deviceAssignment = await this.deviceAssignmentModel.aggregate([
      { $match: { _id: new ObjectId(`${id}`) } },
      {
        $lookup: {
          from: 'devices',
          localField: 'deviceId',
          foreignField: '_id',
          as: 'device',
        },
      },
    ]);
    return deviceAssignment;
  }

  async getList(
    request: GetListDeviceAssignmentRequestDto,
    checkPermission: boolean,
  ): Promise<any> {
    const { keyword, sort, filter, take, user, page } = request;
    const pageIndex = +page || 1;
    const pageSize = +take || 10;
    let filterObj = {};
    let permission = {};
    let sortObj = {};

    if (!isEmpty(keyword)) {
      filterObj = {
        $or: [
          { serial: { $regex: '.*' + keyword + '.*', $options: 'i' } },
          {
            'deviceRequest.device.name': {
              $regex: '.*' + keyword + '.*',
              $options: 'i',
            },
          },
        ],
      };
    }

    if (!checkPermission)
      permission = { $or: [{ 'assign.id': user.id }, { userId: user.id }] };

    filterObj = {
      ...filterObj,
      deletedAt: null,
    };

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'code':
            filterObj = {
              ...filterObj,
              'deviceRequest.device.code': {
                $regex: '.*' + item.text + '.*',
                $options: 'i',
              },
            };
            break;
          case 'deviceName':
            filterObj = {
              ...filterObj,
              'deviceRequest.device.name': {
                $regex: '.*' + item.text + '.*',
                $options: 'i',
              },
            };
            break;
          case 'user':
            filterObj = {
              ...filterObj,
              'deviceRequest.userId': +item.text,
            };
            break;
          case 'serial':
            filterObj = {
              ...filterObj,
              serial: { $regex: '.*' + item.text + '.*', $options: 'i' },
            };
            break;
          case 'status':
            filterObj = { ...filterObj, status: parseInt(item.text) };
            break;
          case 'createdAt':
            filterObj = {
              ...filterObj,
              createdAt: {
                $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                $lt: moment(item.text.split('|')[1]).endOf('day').toDate(),
              },
            };
            break;
          case 'updatedAt':
            filterObj = {
              ...filterObj,
              updatedAt: {
                $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                $lt: moment(item.text.split('|')[1]).endOf('day').toDate(),
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
        const sortDirection = item.order == 'DESC' ? -1 : 1;
        switch (item.column) {
          case 'code':
            sortObj = {
              ...sortObj,
              'deviceRequest.device.code': sortDirection,
            };
            break;
          case 'name':
            sortObj = {
              ...sortObj,
              'deviceRequest.device.name': sortDirection,
            };
            break;
          case 'serial':
            sortObj = { ...sortObj, serial: sortDirection };
            break;
          case 'status':
            sortObj = { ...sortObj, status: sortDirection };
            break;
          case 'assignedAt':
            sortObj = { ...sortObj, assignedAt: sortDirection };
            break;
          case 'usedAt':
            sortObj = { ...sortObj, usedAt: sortDirection };
            break;
          case 'createdAt':
            sortObj = { ...sortObj, createdAt: sortDirection };
            break;
          case 'updatedAt':
            sortObj = { ...sortObj, updatedAt: sortDirection };
            break;
          case 'user':
            sortObj = { ...sortObj };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: -1 };
    }

    const query = [
      {
        $lookup: {
          from: 'deviceRequestTickets',
          localField: 'deviceRequestId',
          foreignField: '_id',
          as: 'deviceRequest',
          pipeline: [
            {
              $lookup: {
                from: 'devices',
                localField: 'device',
                foreignField: '_id',
                as: 'device',
              },
            },
          ],
        },
      },
      {
        $match: {
          ...filterObj,
          ...permission,
        },
      },
      {
        $sort: sortObj,
      },
      {
        $facet: {
          paginatedResults: [
            { $skip: (pageIndex - 1) * pageSize },
            { $limit: pageSize },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ];

    const result = await this.deviceAssignmentModel.aggregate(query);

    return {
      result: result[0].paginatedResults,
      count: result[0]?.totalCount[0]?.count || 0,
      pageIndex,
      pageSize,
    };
  }

  getDetailDeviceAssignment(
    id: string,
    checkPermission: boolean,
    userId: number,
  ): Promise<any> {
    let query;
    if (!checkPermission) {
      query = {
        _id: id,
        deletedAt: null,
        'assign.id': userId,
      };
    } else {
      query = {
        _id: id,
        deletedAt: null,
      };
    }
    return this.deviceAssignmentModel
      .findOne(query)
      .populate('deviceId')
      .populate({
        path: 'deviceRequestId',
        populate: {
          path: 'device',
        },
      })
      .exec();
  }

  async insertMany(data: any[]): Promise<any> {
    return await this.deviceAssignmentModel.insertMany(data);
  }

  getDeviceAssignPrint(serials: string[]): Promise<any> {
    return this.deviceAssignmentModel
      .find({
        serial: {
          $in: serials,
        },
      })
      .populate('deviceId deviceRequestId')
      .exec();
  }

  async exportList(
    request: ExportDeviceAssignRequestDto,
    checkPermission: boolean,
  ): Promise<any> {
    const { sort, filter, user } = request;

    let filterObj = {};
    let permission = {};
    let sortObj = {};

    filterObj = { ...filterObj, deletedAt: null };

    if (!checkPermission) permission = { 'assign.id': user.id };

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'name':
            filterObj = {
              ...filterObj,
              'deviceRequest.device.name': {
                $regex: '.*' + item.text + '.*',
                $options: 'i',
              },
            };
            break;
          case 'serial':
            filterObj = {
              ...filterObj,
              serial: { $regex: '.*' + item.text + '.*', $options: 'i' },
            };
            break;
          case 'model':
            filterObj = {
              ...filterObj,
              'deviceRequest.device.model': {
                $regex: '.*' + item.text + '.*',
                $options: 'i',
              },
            };
            break;
          case 'code':
            filterObj = {
              ...filterObj,
              'deviceRequest.device.code': {
                $regex: '.*' + item.text + '.*',
                $options: 'i',
              },
            };
            break;
          case 'requestCode':
            filterObj = {
              ...filterObj,
              'deviceRequest.code': {
                $regex: '.*' + item.text + '.*',
                $options: 'i',
              },
            };
            break;
          case 'type':
            filterObj = {
              ...filterObj,
              'deviceRequest.device.type': parseInt(item.text),
            };
            break;
          case 'mttrIndex':
            filterObj = {
              ...filterObj,
              'deviceRequest.device.information.mttrIndex': parseInt(item.text),
            };
            break;
          case 'mttaIndex':
            filterObj = {
              ...filterObj,
              'deviceRequest.device.information.mttaIndex': parseInt(item.text),
            };
            break;
          case 'mttfIndex':
            filterObj = {
              ...filterObj,
              'deviceRequest.device.information.mttfIndex': parseInt(item.text),
            };
            break;
          case 'mtbfIndex':
            filterObj = {
              ...filterObj,
              'deviceRequest.device.information.mtbfIndex': parseInt(item.text),
            };
            break;
          case 'maintenancePeriod':
            filterObj = {
              ...filterObj,
              'deviceRequest.device.information.maintenancePeriod': parseInt(
                item.text,
              ),
            };
            break;
          case 'assignedAt':
            filterObj = {
              ...filterObj,
              createdAt: {
                $gte: new Date(`${item.text}T00:00:00.000Z`),
                $lt: new Date(`${item.text}T23:59:59.999Z`),
              },
            };
            break;
          case 'usedAt':
            filterObj = {
              ...filterObj,
              updatedAt: {
                $gte: new Date(`${item.text}T00:00:00.000Z`),
                $lt: new Date(`${item.text}T23:59:59.999Z`),
              },
            };
            break;
          case 'estMaintenceDate':
            filterObj = {
              ...filterObj,
              'deviceRequest.device.information.estMaintenceDate': {
                $gte: new Date(`${item.text}T00:00:00.000Z`),
                $lt: new Date(`${item.text}T23:59:59.999Z`),
              },
            };
            break;
          case 'estReplaceDate':
            filterObj = {
              ...filterObj,
              'deviceRequest.device.information.estReplaceDate': {
                $gte: new Date(`${item.text}T00:00:00.000Z`),
                $lt: new Date(`${item.text}T23:59:59.999Z`),
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
        const sort = item.order == 'DESC' ? -1 : 1;
        switch (item.column) {
          case 'code':
            sortObj = { ...sortObj, 'deviceRequest.device.code': sort };
            break;
          case 'requestCode':
            sortObj = { ...sortObj, 'deviceRequest.code': sort };
            break;
          case 'name':
            sortObj = { ...sortObj, 'deviceRequest.device.name': sort };
            break;
          case 'serial':
            sortObj = { ...sortObj, serial: sort };
            break;
          case 'assignedAt':
            sortObj = { ...sortObj, assignedAt: sort };
            break;
          case 'usedAt':
            sortObj = { ...sortObj, usedAt: sort };
            break;
          case 'model':
            sortObj = { ...sortObj, 'deviceRequest.device.model': sort };
            break;
          case 'type':
            sortObj = { ...sortObj, 'deviceRequest.device.type': sort };
            break;
          case 'assignUser':
            sortObj = { ...sortObj };
            break;
          case 'responsibleUser':
            sortObj = { ...sortObj };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { assignedAt: -1 };
    }

    const query = [
      {
        $lookup: {
          from: 'deviceRequestTickets',
          localField: 'deviceRequestId',
          foreignField: '_id',
          as: 'deviceRequest',
          pipeline: [
            {
              $lookup: {
                from: 'devices',
                localField: 'device',
                foreignField: '_id',
                as: 'device',
              },
            },
          ],
        },
      },
      {
        $match: {
          ...filterObj,
          ...permission,
        },
      },
      {
        $sort: sortObj,
      },
      {
        $facet: {
          paginatedResults: [],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ];

    const result = await this.deviceAssignmentModel.aggregate(query);

    return {
      result: result[0].paginatedResults,
      count: result[0]?.totalCount[0]?.count || 0,
    };
  }

  async getDeviceAssignmentBySerial(serial: string): Promise<any> {
    return await this.deviceAssignmentModel.findOne({
      $and: [{ serial: serial }],
    });
  }

  getListForApp(
    request: GetListDevicesRequestDto,
    checkPermission: boolean,
  ): Promise<[any[], number]> {
    const { keyword, take, skip, user } = request;
    let filterObj = {};
    let permission = {};

    if (!isEmpty(keyword)) {
      filterObj = {
        $or: [
          { serial: { $regex: '.*' + keyword + '.*', $options: 'i' } },
          {
            'deviceId.code': {
              $regex: '.*' + keyword + '.*',
              $options: 'i',
            },
          },
          {
            'deviceId.name': {
              $regex: '.*' + keyword + '.*',
              $options: 'i',
            },
          },
          // TODO: add filter by serial number
        ],
      };
    }

    if (!checkPermission) permission = { userId: user.id };

    filterObj = {
      ...filterObj,
      ...permission,
    };

    const query = this.deviceAssignmentModel.find(filterObj).populate({
      path: 'deviceRequestId',
      populate: {
        path: 'device',
      },
    });

    if (request.isGetAll == '1') {
      return Promise.all([
        query.exec(),
        this.deviceAssignmentModel.estimatedDocumentCount().exec(),
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
        this.deviceAssignmentModel.estimatedDocumentCount().exec(),
      ]);
    }
  }

  async deviceAssignmentWithRelation(
    pageSize = 10,
    pageIndex = 1,
  ): Promise<any> {
    const query = [
      {
        $lookup: {
          from: 'devices',
          localField: 'deviceId',
          foreignField: '_id',
          as: 'device',
        },
      },
      {
        $lookup: {
          from: 'checklistTemplates',
          localField: 'deviceId',
          foreignField: 'deviceId',
          as: 'checkListTemplate',
        },
      },
      {
        $lookup: {
          from: 'warnings',
          localField: '_id',
          foreignField: 'deviceAssignmentId',
          as: 'warning',
        },
      },
      {
        $match: {
          status: {
            $nin: [
              DeviceAssignStatus.AwaitingConfirmation,
              DEVICE_ASIGNMENTS_STATUS_ENUM.IN_SCRAPPING,
            ],
          },
        },
      },
      { $skip: (pageIndex - 1) * pageSize },
      { $limit: pageSize },
    ];
    const [result, totalAllItem] = await Promise.all([
      this.deviceAssignmentModel.aggregate(query),
      this.model.count(),
    ]);
    return { items: result, count: totalAllItem };
  }
  countDocumentsByDeviceId(deviceId: string): Promise<number> {
    return this.deviceAssignmentModel
      .find({
        deviceId,
      })
      .countDocuments()
      .exec();
  }

  countDocumentsByDeviceRequest(deviceRequestId: string): Promise<number> {
    return this.deviceAssignmentModel
      .find({
        deviceRequestId,
        deletedAt: null,
      })
      .countDocuments()
      .exec();
  }

  async getListReportDeviceAssignStatus(
    request: ListReportDeviceAssignStatusQuery,
  ): Promise<{ result: any[]; count: number }> {
    let filterObj = {};
    let filterDeviceObj = {};
    let sortObj = {};
    let factory = {};
    let workCenter = {};
    let device = {};
    let deviceGroup = {};
    let userObj = {};

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
    if (request.deviceId !== null && request.deviceId !== undefined) {
      device = {
        deviceId: new Types.ObjectId(request.deviceId),
      };
    }
    if (request.deviceGroupId !== null && request.deviceGroupId !== undefined) {
      deviceGroup = {
        'device.deviceGroup': new Types.ObjectId(request.deviceGroupId),
      };
    }
    if (request.assignUserId !== null && request.assignUserId !== undefined) {
      userObj = {
        'deviceRequest.userId': request.assignUserId,
      };
    }

    if (!isEmpty(request.filter)) {
      request.filter.forEach((item) => {
        switch (item.column) {
          case 'serial':
            filterObj = {
              ...filterObj,
              serial: { $regex: '.*' + item.text + '.*', $options: 'i' },
            };
            break;
          case 'deviceName':
            filterDeviceObj = {
              ...filterDeviceObj,
              'device.name': {
                $regex: '.*' + item.text + '.*',
                $options: 'i',
              },
            };
            break;
          case 'status':
            filterObj = { ...filterObj, status: parseInt(item.text) };
            break;
          case 'usedAt':
            filterObj = {
              ...filterObj,
              usedAt: {
                $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                $lte: moment(item.text.split('|')[1]).startOf('day').toDate(),
              },
            };
            break;
          default:
            break;
        }
      });
    }

    if (!isEmpty(request.sort)) {
      request.sort.forEach((item) => {
        switch (item.column) {
          case 'serial':
            sortObj = { serial: convertOrderMongo(item.order) };
            break;
          case 'deviceName':
            sortObj = { name: convertOrderMongo(item.order) };
            break;
          default:
            sortObj = { createdAt: -1 };
            break;
        }
      });
    } else {
      sortObj = { createdAt: -1 };
    }

    const result = await this.deviceAssignmentModel.aggregate([
      {
        $lookup: {
          from: 'devices',
          localField: 'deviceId',
          foreignField: '_id',
          as: 'device',
        },
      },
      {
        $unwind: '$device',
      },
      {
        $lookup: {
          from: 'deviceRequestTickets',
          localField: 'deviceRequestId',
          foreignField: '_id',
          as: 'deviceRequest',
        },
      },
      {
        $match: {
          ...filterObj,
          ...workCenter,
          ...factory,
          ...device,
          ...deviceGroup,
          ...filterDeviceObj,
          ...userObj,
          deletedAt: null,
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

  async getDeviceAssignment(): Promise<any> {
    const query = [
      {
        $lookup: {
          from: 'devices',
          localField: 'deviceId',
          foreignField: '_id',
          as: 'device',
        },
      },
      {
        $match: {
          status: { $nin: [DEVICE_ASIGNMENTS_STATUS_ENUM.IN_SCRAPPING] },
        },
      },
    ];
    return await this.deviceAssignmentModel.aggregate(query);
  }

  async getDeviceAssignmentByIds(ids: string[]): Promise<any> {
    const query = [
      {
        $lookup: {
          from: 'devices',
          localField: 'deviceId',
          foreignField: '_id',
          as: 'device',
        },
      },
      {
        $match: {
          status: { $nin: [DEVICE_ASIGNMENTS_STATUS_ENUM.IN_SCRAPPING] },
          _id: {
            $in: ids,
          },
        },
      },
    ];
    return await this.deviceAssignmentModel.aggregate(query);
  }

  async getListSerialInUse(serial?: string): Promise<any> {
    let filterObj = {};
    if (!isEmpty(serial)) filterObj = { serial };
    const query = [
      {
        $lookup: {
          from: 'devices',
          localField: 'deviceId',
          foreignField: '_id',
          as: 'device',
        },
      },
      {
        $lookup: {
          from: 'deviceRequestTickets',
          localField: 'deviceRequestId',
          foreignField: '_id',
          as: 'deviceRequest',
        },
      },
      {
        $match: {
          status: 1,
          ...filterObj,
        },
      },
      {
        $project: {
          serial: 1,
          device: 1,
          deviceRequest: 1,
        },
      },
      {
        $facet: {
          paginatedResults: [],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ];
    const result = await this.deviceAssignmentModel.aggregate(query);

    return {
      result: result[0].paginatedResults,
      count: result[0]?.totalCount[0]?.count || 0,
    };
  }

  async findByIdsAndUpdate(ids: Types.ObjectId[], update: any): Promise<void> {
    const query = this.deviceAssignmentModel.updateMany(
      {
        _id: {
          $in: ids,
        },
      },
      update,
    );

    await query.exec();
  }

  async listSerialByDevice(
    request: ListSerialByDeviceQuery,
  ): Promise<{ data: any; count: number }> {
    let status = [];
    if (!isEmpty(request.filter)) {
      request.filter.forEach((item) => {
        const value = item ? item.text : null;
        switch (item.column) {
          case 'status':
            status = value.split(',');
          default:
            break;
        }
      });
    }
    let data = [];
    let count;
    if (Number(request.isGetAll) == GetAllConstant.YES) {
      data = await this.deviceAssignmentModel
        .find({
          status: {
            $in: status,
          },
          deviceId: request.deviceId,
        })
        .populate('deviceId')
        .exec();
      count = await this.deviceAssignmentModel
        .find({
          status: {
            $in: status,
          },
          deviceId: request.deviceId,
        })
        .populate('deviceId')
        .countDocuments()
        .exec();
    } else {
      data = await this.deviceAssignmentModel
        .find({
          status: {
            $in: status,
          },
          deviceId: request.deviceId,
        })
        .populate('deviceId')
        .skip(request.skip)
        .limit(request.take)
        .exec();
      count = await this.deviceAssignmentModel
        .find({
          status: {
            $in: status,
          },
          deviceId: request.deviceId,
        })
        .populate('deviceId')
        .countDocuments()
        .exec();
    }

    return { data, count };
  }

  async listSerialByDeviceIds(request: ListSerialByDeviceIds): Promise<any> {
    const { filter, deviceIds } = request;
    let status = [];
    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        const value = item ? item.text : null;
        switch (item.column) {
          case 'status':
            status = value.split(',');
          default:
            break;
        }
      });
    }
    return await this.deviceAssignmentModel
      .find({
        $and: [
          { deviceId: { $in: deviceIds.split(',') } },
          {
            status: {
              $in: status,
            },
          },
        ],
      })
      .populate('deviceId');
  }

  async listDeviceStatus(request: ListDeviceStatusQuery): Promise<any> {
    let filterObj;
    let keywordObj;
    let sortObj;

    if (!isEmpty(request.keyword)) {
      keywordObj = {
        $or: [
          { serial: { $regex: '.*' + request.keyword + '.*', $options: 'i' } },
          {
            'device.name': {
              $regex: '.*' + request.keyword + '.*',
              $options: 'i',
            },
          },
        ],
      };
    }

    if (!isEmpty(request.filter)) {
      request.filter.forEach((item) => {
        switch (item.column) {
          case 'serial':
            filterObj = {
              serial: { $regex: '.*' + item.text + '.*', $options: 'i' },
            };
            break;
          case 'deviceName':
            filterObj = {
              'device.name': { $regex: '.*' + item.text + '.*', $options: 'i' },
            };
            break;
          case 'status':
            filterObj = { ...filterObj, status: parseInt(item.text) };
            break;
          default:
            break;
        }
      });
    }

    if (!isEmpty(request.sort)) {
      request.sort.forEach((item) => {
        const order = item.order?.toSortOrder();
        switch (item.column) {
          case 'serial':
            sortObj = { code: order };
            break;
          case 'device.name':
            sortObj = { name: order };
            break;
          case 'status':
            sortObj = { status: order };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { updatedAt: -1 };
    }

    const query = await this.deviceAssignmentModel
      .aggregate([
        {
          $lookup: {
            from: 'deviceStatuses',
            localField: '_id',
            foreignField: 'deviceAssignmentId',
            as: 'deviceStatuses',
            pipeline: [
              {
                $sort: {
                  endDate: -1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'devices',
            localField: 'deviceId',
            foreignField: '_id',
            as: 'device',
          },
        },
        {
          $match: {
            'device.type': DeviceType.ForManufacture,
            status: {
              $nin: [
                DEVICE_ASIGNMENTS_STATUS_ENUM.IN_SCRAPPING,
                DEVICE_ASIGNMENTS_STATUS_ENUM.RETURNED,
                DEVICE_ASIGNMENTS_STATUS_ENUM.UN_USE,
              ],
            },
            ...filterObj,
            ...keywordObj,
          },
        },
        {
          $sort: sortObj,
        },
        {
          $facet: {
            data: [
              { $skip: (request.page - 1) * request.take },
              { $limit: request.take },
            ],
            count: [
              {
                $count: 'count',
              },
            ],
          },
        },
      ])
      .exec();
    return {
      data: query[0]?.data || [],
      count: query[0]?.count[0]?.count || 0,
    };
  }

  async findAllWithPopulate(condition: any, populate: any): Promise<any> {
    return this.deviceAssignmentModel.find(condition).populate(populate).exec();
  }

  async dashboardDevicestatus(
    request: GetDashboardDeviceStatusRequestDto,
  ): Promise<any[]> {
    let filterObj;

    if (request.factoryId) {
      filterObj = {
        factoryId: request.factoryId,
      };
    }

    return await this.deviceAssignmentModel
      .aggregate([
        {
          $lookup: {
            from: 'deviceStatuses',
            localField: '_id',
            foreignField: 'deviceAssignmentId',
            as: 'deviceStatuses',
            pipeline: [
              { $sort: { createdAt: -1 } },
              { $limit: 1 },
              {
                $project: {
                  deviceAssignmentId: 1,
                  endDate: 1,
                  startDate: 1,
                  status: 1,
                  moId: 1,
                  updatedAt: 1,
                  numOfStop: {
                    $cond: [
                      { $eq: ['$status', DEVICE_STATUS_ENUM.STOP] },
                      1,
                      0,
                    ],
                  },
                  numOfActive: {
                    $cond: [
                      { $eq: ['$status', DEVICE_STATUS_ENUM.ACTIVE] },
                      1,
                      0,
                    ],
                  },
                  numOfError: {
                    $cond: [
                      { $eq: ['$status', DEVICE_STATUS_ENUM.ERROR] },
                      1,
                      0,
                    ],
                  },
                  numOfOff: {
                    $cond: [{ $eq: ['$status', DEVICE_STATUS_ENUM.OFF] }, 1, 0],
                  },
                  numOfMaintain: {
                    $cond: [
                      { $eq: ['$status', DEVICE_STATUS_ENUM.MAINTENANCE] },
                      1,
                      0,
                    ],
                  },
                  numOfUse: {
                    $cond: [
                      { $eq: ['$status', DEVICE_STATUS_ENUM.IN_USE] },
                      1,
                      0,
                    ],
                  },
                  timeAction: {
                    $cond: [
                      { $eq: ['$status', DEVICE_STATUS_ENUM.ACTIVE] },
                      {
                        $divide: [
                          { $subtract: ['$endDate', '$startDate'] },
                          60000,
                        ],
                      },
                      0,
                    ],
                  },
                  timeRest: {
                    $cond: [
                      { $ne: ['$status', DEVICE_STATUS_ENUM.ACTIVE] },
                      {
                        $divide: [
                          { $subtract: ['$endDate', '$startDate'] },
                          60000,
                        ],
                      },
                      0,
                    ],
                  },
                  actualQty: {
                    $cond: [
                      { $eq: ['$status', DEVICE_STATUS_ENUM.ACTIVE] },
                      '$actualQuantity',
                      0,
                    ],
                  },
                  passQty: {
                    $cond: [
                      { $eq: ['$status', DEVICE_STATUS_ENUM.ACTIVE] },
                      '$passQuantity',
                      0,
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: '$deviceAssignmentId',
                  numOfStop: { $sum: '$numOfStop' },
                  numOfActive: { $sum: '$numOfActive' },
                  numOfError: { $sum: '$numOfError' },
                  numOfOff: { $sum: '$numOfOff' },
                  numOfMaintain: { $sum: '$numOfMaintain' },
                  numOfUse: { $sum: '$numOfUse' },
                  timeAction: { $sum: '$timeAction' },
                  timeRest: { $sum: '$timeRest' },
                  date: { $max: '$updatedAt' },
                  listStatus: {
                    $push: {
                      status: '$status',
                      endDate: '$endDate',
                    },
                  },
                  dateRange: {
                    $push: {
                      startDate: '$startDate',
                      endDate: '$endDate',
                    },
                  },
                  moIds: {
                    $addToSet: '$moId',
                  },
                  passQuantity: { $sum: '$passQty' },
                  actualQuantity: { $sum: '$actualQty' },
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: 'devices',
            localField: 'deviceId',
            foreignField: '_id',
            as: 'device',
          },
        },
        {
          $match: {
            'device.type': DeviceType.ForManufacture,
            status: {
              $nin: [
                DEVICE_ASIGNMENTS_STATUS_ENUM.IN_SCRAPPING,
                DEVICE_ASIGNMENTS_STATUS_ENUM.RETURNED,
                DEVICE_ASIGNMENTS_STATUS_ENUM.UN_USE,
              ],
            },
            ...filterObj,
          },
        },
      ])
      .exec();
  }

  async deviceAssignmentWithRelationByIds(ids: string[]): Promise<any[]> {
    const query = [
      {
        $lookup: {
          from: 'devices',
          localField: 'deviceId',
          foreignField: '_id',
          as: 'device',
        },
      },
      {
        $lookup: {
          from: 'checklistTemplates',
          localField: 'deviceId',
          foreignField: 'deviceId',
          as: 'checkListTemplate',
        },
      },
      {
        $lookup: {
          from: 'warnings',
          localField: '_id',
          foreignField: 'deviceAssignmentId',
          as: 'warning',
        },
      },
      {
        $match: {
          _id: {
            $in: ids,
          },
          status: {
            $nin: [
              DeviceAssignStatus.AwaitingConfirmation,
              DEVICE_ASIGNMENTS_STATUS_ENUM.IN_SCRAPPING,
            ],
          },
        },
      },
    ];
    return await this.deviceAssignmentModel.aggregate(query);
  }
}
