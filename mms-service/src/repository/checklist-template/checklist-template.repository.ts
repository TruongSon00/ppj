import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { ChecklistTemplate } from '../../models/checklist-template/checklist-template.model';
import { CheckListTemplateRepositoryInterface } from '@components/checklist-template/interface/checklist-template.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isEmpty } from 'lodash';
import { GetListCheckListTemplateRequestDto } from '@components/checklist-template/dto/request/get-list-checklist-template.request.dto';
import * as moment from 'moment';

@Injectable()
export class CheckListTemplateRepository
  extends BaseAbstractRepository<ChecklistTemplate>
  implements CheckListTemplateRepositoryInterface
{
  constructor(
    @InjectModel('CheckListTemplate')
    private readonly checkListTemplateModel: Model<ChecklistTemplate>,
  ) {
    super(checkListTemplateModel);
  }
  async detail(id: string): Promise<any> {
    const result = await this.checkListTemplateModel
      .findById(id)
      .populate('details')
      .populate('histories')
      .lean();
    return result;
  }
  async delete(id: string): Promise<any> {
    const result = await this.checkListTemplateModel.findByIdAndDelete(id);
    return result;
  }
  createEntity(param: any): ChecklistTemplate {
    const document = new this.checkListTemplateModel();
    document.code = param.code;
    document.name = param.name;
    document.description = param.description;
    document.checkType = param.checkType;
    document.details = param.details;
    return document;
  }

  updateEntity(entity: ChecklistTemplate, request: any): ChecklistTemplate {
    entity.name = request.name;
    entity.description = request.description;
    entity.checkType = request.checkType;
    entity.details = request.details;
    return entity;
  }

  async getList(request: GetListCheckListTemplateRequestDto): Promise<any> {
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
    if (request.queryIds) {
      filterObj = {
        ...filterObj,
        id: {
          $in: request.queryIds,
        },
      };
    }
    const deletedObj = { deletedAt: null };

    const query = this.checkListTemplateModel
      .aggregate()
      .match(deletedObj)
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
      await query.buildPaginationQuery(skip, take, sortObj).exec()
    )[0];

    return { result: queryResult.data, count: queryResult.total };
  }

  async update(param: any): Promise<any> {
    const result = await this.checkListTemplateModel
      .findByIdAndUpdate(param._id, {
        code: param.code,
        name: param.name,
        description: param.description,
        checkType: param.checkType,
        details: param.details,
      })
      .populate('histories');
    result.histories.push(param.history);
    return await result.save();
  }

  async getListCheckListTemplateByIds(ids: string[]): Promise<any> {
    return await this.checkListTemplateModel.find({ _id: { $in: ids } });
  }
}
