import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { SupplyGroup } from 'src/models/supply-group/supply-group.model';
import { SupplyGroupRepositoryInterface } from '@components/supply-group/interface/supply-group.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isEmpty } from 'lodash';
import { GetListSupplyGroupRequestDto } from '@components/supply-group/dto/request/get-list-supply-group.request.dto';
import { FieldVisibility } from '@constant/database.constant';
import * as moment from 'moment';

@Injectable()
export class SupplyGroupRepository
  extends BaseAbstractRepository<SupplyGroup>
  implements SupplyGroupRepositoryInterface
{
  constructor(
    @InjectModel('SupplyGroup')
    private readonly supplyGroupModel: Model<SupplyGroup>,
  ) {
    super(supplyGroupModel);
  }
  createDocument(param: any): SupplyGroup {
    const document = new this.supplyGroupModel();
    document.code = param.code;
    document.name = param.name;
    document.description = param.description;
    return document;
  }

  async getList(request: GetListSupplyGroupRequestDto): Promise<any> {
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
          case 'active':
            filterObj = {
              ...filterObj,
              $and: [{ active: parseInt(value) }],
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
    const query = this.supplyGroupModel.aggregate().match(filterObj);
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
          case 'active':
            sortObj = { status: order };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: -1 };
    }
    const queryResult = (
      await query
        .project({
          id: '$_id',
          _id: FieldVisibility.Visible,
          code: FieldVisibility.Visible,
          name: FieldVisibility.Visible,
          description: FieldVisibility.Visible,
          active: FieldVisibility.Visible,
          createdAt: FieldVisibility.Visible,
          updatedAt: FieldVisibility.Visible,
        })
        .buildPaginationQuery(skip, take, sortObj)
        .exec()
    )[0];

    return { result: queryResult.data, count: queryResult.total };
  }

  updateEntity(entity: SupplyGroup, data: any): SupplyGroup {
    entity.name = data.name;
    entity.description = data.description;
    return entity;
  }

  async import(bulkOps: any): Promise<any> {
    return await this.supplyGroupModel.bulkWrite(bulkOps);
  }
}
