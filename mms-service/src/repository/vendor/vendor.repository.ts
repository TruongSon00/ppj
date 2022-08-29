import { GetListVendorRequestDto } from '@components/vendor/dto/request/get-list-vendor.request.dto';
import { VendorRepositoryInterface } from '@components/vendor/interface/vendor.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Model, Types } from 'mongoose';
import { VendorModel } from 'src/models/vendor/vendor.model';

@Injectable()
export class VendorRepository
  extends BaseAbstractRepository<VendorModel>
  implements VendorRepositoryInterface
{
  constructor(
    @InjectModel('VendorModel')
    private readonly vendorModel: Model<VendorModel>,
  ) {
    super(vendorModel);
  }

  async list(request: GetListVendorRequestDto): Promise<any> {
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

    if (!isEmpty(request.queryIds)) {
      filterObj = {
        ...filterObj,
        _id: {
          $in: request.queryIds.map((id) => new Types.ObjectId(id)),
        },
      };
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        const value = item ? item.text : null;
        switch (item.column) {
          case 'code':
            filterObj = {
              ...filterObj,
              code: {
                $regex: '.*' + value + '.*',
                $options: 'i',
              },
            };
            break;
          case 'name':
            filterObj = {
              ...filterObj,
              name: {
                $regex: '.*' + value + '.*',
                $options: 'i',
              },
            };
            break;
          case 'createdAt':
            filterObj = {
              ...filterObj,
              createdAt: {
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

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        const order = item.order?.toSortOrder();
        switch (item.column) {
          case 'code':
            sortObj = { code: order };
            break;
          case 'name':
            sortObj = { name: order };
            break;
          case 'createdAt':
            sortObj = { createdAt: order };
            break;
          case 'updatedAt':
            sortObj = { updatedAt: order };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: -1 };
    }

    const result = await this.vendorModel
      .find({ deletedAt: null })
      .find(filterObj)
      .limit(take)
      .skip(skip)
      .sort(sortObj)
      .exec();

    const total: number = await this.vendorModel
      .find({ deletedAt: null })
      .find(filterObj)
      .countDocuments()
      .exec();

    return { data: result, count: total };
  }

  async import(bulkOps: any): Promise<any> {
    return await this.vendorModel.bulkWrite(bulkOps);
  }
}
