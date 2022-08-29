import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Promise } from 'mongoose';
import { Supply } from '../../models/supply/supply.model';
import { SupplyRepositoryInterface } from '@components/supply/interface/supply.repository.interface';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import * as mongoose from 'mongoose';
import { SUPPLY_GROUP_CONST } from '@components/supply-group/supply-group.constant';
import {
  SUPPLY_CONST,
  SupplyStatusConstant,
} from '@components/supply/supply.constant';
import { FieldVisibility } from '@constant/database.constant';
import * as moment from 'moment';

@Injectable()
export class SupplyRepository
  extends BaseAbstractRepository<Supply>
  implements SupplyRepositoryInterface
{
  constructor(
    @InjectModel('Supply')
    private readonly supplyModel: Model<Supply>,
  ) {
    super(supplyModel);
  }

  createDocument(param: any): Supply {
    const document = new this.supplyModel();
    document.code = param.code;
    document.name = param.name;
    document.description = param.description;
    document.type = param.type;
    document.itemUnitId = param.itemUnitId;
    document.responsibleUserIds = param.responsibleUserIds;
    document.responsibleMaintenanceTeam = param.responsibleMaintenanceTeam;
    document.groupSupplyId = param.groupSupplyId;
    document.status = param.status;
    document.price = param.price;
    document.receivedDate = param.receivedDate;
    document.vendorId = param.vendorId;
    return document;
  }
  async detail(id: string): Promise<any> {
    const result = await this.supplyModel.findById(id).populate('histories');
    return result;
  }

  async checkCodeExists(code: string): Promise<any> {
    const result = await this.supplyModel.findOne({ code: code });
    return result;
  }

  async checkSupplyGroupExist(id: string): Promise<any> {
    const result = await this.supplyModel.find({ groupSupplyId: id });
    return result;
  }

  async getList(request: any): Promise<any> {
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
          case 'supplyGroupName':
            filterObj = {
              ...filterObj,
              $and: [
                {
                  'groupSupplyId.name': {
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
          case 'type':
            filterObj = {
              ...filterObj,
              $and: [{ type: parseInt(value) }],
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
    const supplyGroupColumn = SUPPLY_CONST.SUPPLY_GROUP.COLUMN;

    const query = this.supplyModel
      .aggregate()
      .lookup({
        from: SUPPLY_GROUP_CONST.COLL,
        localField: supplyGroupColumn,
        foreignField: SUPPLY_GROUP_CONST.ID.COLUMN,
        as: supplyGroupColumn,
      })
      .unwind({
        path: `$${supplyGroupColumn}`,
        preserveNullAndEmptyArrays: true,
      })
      .match(filterObj);

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
          case 'status':
            sortObj = { status: order };
            break;
          case 'type':
            sortObj = { type: order };
            break;
          case 'supplyGroupName':
            sortObj = { 'supplyGroup.name': order };
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
    const queryResult = (
      await query
        .project({
          // id: '$_id',
          _id: FieldVisibility.Visible,
          code: FieldVisibility.Visible,
          name: FieldVisibility.Visible,
          description: FieldVisibility.Visible,
          type: FieldVisibility.Visible,
          itemUnitId: FieldVisibility.Visible,
          responsibleUserIds: FieldVisibility.Visible,
          responsibleMaintenanceTeam: FieldVisibility.Visible,
          price: FieldVisibility.Visible,
          status: FieldVisibility.Visible,
          vendorId: FieldVisibility.Visible,
          createdAt: FieldVisibility.Visible,
          updatedAt: FieldVisibility.Visible,
          supplyGroup: {
            id: '$groupSupplyId._id',
            name: '$groupSupplyId.name',
          },
        })
        .buildPaginationQuery(skip, take, sortObj)
        .exec()
    )[0];

    return { result: queryResult.data, count: queryResult.total };
  }

  async update(param: any): Promise<any> {
    const result = await this.supplyModel
      .findByIdAndUpdate(param._id, {
        name: param.name,
        description: param.description,
        factoryId: param.factoryId,
        type: param.type,
        itemUnitId: param.itemUnitId,
        responsibleUserIds: param.responsibleUserIds,
        responsibleMaintenanceTeam: param.responsibleMaintenanceTeam,
        supplyGroup: param.supplyGroup,
        price: param.price,
        status: param.status,
        vendorId: param.vendorId,
        receivedDate: param.receivedDate,
      })
      .populate('histories');
    result.histories.push(param.history);
    return await result.save();
  }
  async delete(id: string): Promise<any> {
    const result = await this.supplyModel.findByIdAndDelete(id);
    return result;
  }

  async findMaintenanceTeam(id: string): Promise<any> {
    return this.supplyModel.findOne({ responsibleMaintenanceTeam: id });
  }

  async getByIds(ids: string[]) {
    const supplyIds = ids.map((id) => new mongoose.Types.ObjectId(id));
    const result = await this.supplyModel.aggregate([
      { $match: { _id: { $in: supplyIds } } },
    ]);

    return result;
  }

  async findSupplyConfirmed(): Promise<any> {
    const result = await this.supplyModel.find({
      status: SupplyStatusConstant.CONFIRMED,
    });
    return result;
  }
  async getListSupplyByIds(ids: string[]): Promise<any> {
    return await this.supplyModel.find({ _id: { $in: ids } });
  }
}
