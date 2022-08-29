import { DEVICE_REQUEST_STATUS_ENUM } from 'src/components/device-request/device-request.constant';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceRequestTicketRepositoryInterface } from '@components/device-request/interface/device-request-ticket.repository.interface';
import { DeviceRequestTicket } from 'src/models/device-request-ticket/device-request-ticket.model';
import { CreateDeviceRequestTicketRequestDto } from '@components/device-request/dto/request/request-ticket/create-device-request-ticket.request.dto';
import { ListDeviceRequestsRequestDto } from '@components/device-request/dto/request/list-device-requests.request.dto';
import { isEmpty } from 'lodash';
import { SortOrder } from '@constant/database.constant';
import * as moment from 'moment';

@Injectable()
export class DeviceRequestTicketRepository
  extends BaseAbstractRepository<DeviceRequestTicket>
  implements DeviceRequestTicketRepositoryInterface
{
  constructor(
    @InjectModel('DeviceRequestTicket')
    private readonly deviceRequestTicketModel: Model<DeviceRequestTicket>,
  ) {
    super(deviceRequestTicketModel);
  }

  async getLatest(): Promise<DeviceRequestTicket> {
    return await this.deviceRequestTicketModel
      .findOne(null, 'code', {
        sort: {
          _id: SortOrder.Descending,
        },
      })
      .exec();
  }

  createDocument(
    request: CreateDeviceRequestTicketRequestDto,
    code: string,
  ): DeviceRequestTicket {
    const deviceRequestTicket = new this.deviceRequestTicketModel();
    deviceRequestTicket.code = code;
    deviceRequestTicket.name = request.name;
    deviceRequestTicket.description = request.description;
    deviceRequestTicket.factoryId = request.factoryId;
    deviceRequestTicket.quantity = request.quantity || request.deviceIds.length;
    deviceRequestTicket.createdBy = request.userId;
    deviceRequestTicket.deviceGroupIds = request.deviceGroupIds;
    deviceRequestTicket.type = request.type;
    deviceRequestTicket.deviceIds = request.deviceIds || [];
    deviceRequestTicket.status =
      DEVICE_REQUEST_STATUS_ENUM.WAITING_LEADER_APPROVE;
    return deviceRequestTicket;
  }

  async getList(request: ListDeviceRequestsRequestDto): Promise<any> {
    const { keyword, sort, filter, take, skip } = request;

    const filterObj = {};
    let sortObj = {};

    filterObj['$and'] = [
      {
        deletedAt: null,
      },
    ];
    if (!isEmpty(keyword)) {
      filterObj['$or'] = [
        { code: { $regex: '.*' + keyword + '.*', $options: 'i' } },
        { name: { $regex: '.*' + keyword + '.*', $options: 'i' } },
      ];
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        const text = item.text?.toLowerCase();
        switch (item.column) {
          case 'code':
            filterObj['$and'].push({
              code: { $regex: '.*' + text + '.*', $options: 'i' },
            });
            break;
          case 'name':
            filterObj['$and'].push({
              name: { $regex: '.*' + text + '.*', $options: 'i' },
            });
            break;
          case 'type':
            filterObj['$and'].push({
              type: text,
            });
            break;
          case 'status':
            filterObj['$and'].push({
              status: Number(text),
            });
            break;
          case 'deviceGroupCode':
            filterObj['$and'].push({
              'deviceGroups.code': {
                $regex: '.*' + text + '.*',
                $options: 'i',
              },
            });
            break;
          case 'deviceGroupName':
            filterObj['$and'].push({
              'deviceGroups.name': {
                $regex: '.*' + text + '.*',
                $options: 'i',
              },
            });
            break;
          case 'deviceSerial':
            filterObj['$and'].push({
              'device.serial': {
                $regex: '.*' + text + '.*',
                $options: 'i',
              },
            });
            break;
          case 'deviceName':
            filterObj['$and'].push({
              'device.name': {
                $regex: '.*' + text + '.*',
                $options: 'i',
              },
            });
            break;
          case 'createdAt':
            filterObj['$and'].push({
              createdAt: {
                $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                $lte: moment(item.text.split('|')[1]).endOf('day').toDate(),
              },
            });
            break;
          case 'updatedAt':
            filterObj['$and'].push({
              updatedAt: {
                $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                $lte: moment(item.text.split('|')[1]).endOf('day').toDate(),
              },
            });
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
          case 'code':
            sortObj['code'] = order;
            break;
          case 'name':
            sortObj['name'] = order;
            break;
          case 'deviceGroupCode':
            sortObj['deviceGroups.code'] = order;
            break;
          case 'deviceGroupName':
            sortObj['deviceGroups.name'] = order;
            break;
          case 'deviceSerial':
            sortObj['devices.serial'] = order;
            break;
          case 'deviceName':
            sortObj['devices.name'] = order;
            break;
          case 'createdAt':
            sortObj['createdAt'] = order;
            break;
          case 'updatedAt':
            sortObj['updatedAt'] = order;
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: SortOrder.Descending };
    }

    const res = await this.deviceRequestTicketModel
      .aggregate()
      .lookup({
        from: 'deviceGroups',
        localField: 'deviceGroupIds',
        foreignField: '_id',
        as: 'deviceGroups',
      })
      .lookup({
        from: 'devices',
        localField: 'deviceIds',
        foreignField: '_id',
        as: 'devices',
      })
      .unwind({
        path: `$deviceGroupIds`,
        preserveNullAndEmptyArrays: true,
      })
      .unwind({
        path: `$deviceIds`,
        preserveNullAndEmptyArrays: true,
      })
      .match(filterObj)
      .limit(take)
      .skip(skip);

    const count = await this.deviceRequestTicketModel.count(filterObj);
    return {
      items: res,
      count: count,
    };
  }

  updateDocument(entity: DeviceRequestTicket, data: any): DeviceRequestTicket {
    entity.name = data.name;
    entity.factoryId = data.factoryId;
    entity.deviceGroupIds = data.deviceGroupIds;
    entity.description = data.description;
    entity.quantity = data.quantity;
    entity.deviceIds = data.deviceIds;
    return entity;
  }
}
