import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { DeviceGroup } from '../../models/device-group/device-group.model';
import { DeviceGroupRepositoryInterface } from '@components/device-group/interface/device-group.repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetListDeviceGroupRequestDto } from '@components/device-group/dto/request/get-list-device-group.request.dto';
import { isEmpty } from 'lodash';
import * as moment from 'moment';

@Injectable()
export class DeviceGroupRepository
  extends BaseAbstractRepository<DeviceGroup>
  implements DeviceGroupRepositoryInterface
{
  constructor(
    @InjectModel('DeviceGroup')
    private readonly deviceGroupModel: Model<DeviceGroup>,
  ) {
    super(deviceGroupModel);
  }
  createDocument(param: any): DeviceGroup {
    const document = new this.deviceGroupModel();
    document.code = param.code;
    document.name = param.name;
    document.description = param.description;
    document.supplies = param.supplies;
    return document;
  }
  async getList(request: GetListDeviceGroupRequestDto): Promise<any> {
    const { keyword, sort, filter, take, skip } = request;
    let filterObj = {};
    let sortObj = {};
    if (!isEmpty(keyword)) {
      filterObj = {
        $or: [
          { code: { $regex: '.*' + keyword + '.*', $options: 'i' } },
          { name: { $regex: '.*' + keyword + '.*', $options: 'i' } },
        ],
      };
    }
    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        const value = item ? item.text : null;
        switch (item.column) {
          case 'code':
            filterObj = {
              ...filterObj,
              $and: [
                {
                  code: {
                    $regex: '.*' + value + '.*',
                    $options: 'i',
                  },
                },
              ],
            };
            break;
          case 'name':
            filterObj = {
              ...filterObj,
              $and: [
                {
                  name: {
                    $regex: '.*' + value + '.*',
                    $options: 'i',
                  },
                },
              ],
            };
            break;
          case 'status':
            filterObj = {
              ...filterObj,
              $and: [{ status: parseInt(value) }],
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
        switch (item.column) {
          case 'code':
            sortObj = { code: item.order?.toSortOrder() };
            break;
          case 'name':
            sortObj = { name: item.order?.toSortOrder() };
            break;
          case 'status':
            sortObj = { status: item.order?.toSortOrder() };
            break;
          case 'createdAt':
            sortObj = { createdAt: item.order?.toSortOrder() };
            break;
          case 'updatedAt':
            sortObj = { updatedAt: item.order?.toSortOrder() };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: -1 };
    }
    const result = await this.deviceGroupModel
      .find(filterObj)
      .limit(take)
      .skip(skip)
      .sort(sortObj)
      .exec();

    const total: number = await this.deviceGroupModel
      .find(filterObj)
      .countDocuments()
      .exec();

    return { result: result, count: total };
  }

  async import(bulkOps: any): Promise<any> {
    return await this.deviceGroupModel.bulkWrite(bulkOps);
  }
}
