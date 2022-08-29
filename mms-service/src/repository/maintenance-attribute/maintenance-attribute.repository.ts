import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { MaintenanceAttribute } from '../../models/maintenance-attribute/maintenance-attribute.model';
import { MaintenanceAttributeRepositoryInterface } from '@components/maintenance-attribute/interface/maintenance-attribute.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isEmpty } from 'lodash';
import { GetListMaintenanceAttributeRequestDto } from '@components/maintenance-attribute/dto/request/get-list-maintenance-attribute.request.dto';

@Injectable()
export class MaintenanceAttributeRepository
  extends BaseAbstractRepository<MaintenanceAttribute>
  implements MaintenanceAttributeRepositoryInterface
{
  constructor(
    @InjectModel('MaintenanceAttribute')
    private readonly maintenanceAttribute: Model<MaintenanceAttribute>,
  ) {
    super(maintenanceAttribute);
  }
  async detail(id: string): Promise<any> {
    const result = await this.maintenanceAttribute
      .findById(id)
      .populate('histories')
      .lean();
    return result;
  }
  createDocument(param: any): MaintenanceAttribute {
    const document = new this.maintenanceAttribute();
    document.code = param.code;
    document.name = param.name;
    document.description = param.description;
    document.isDeleted = param.isDeleted;
    return document;
  }
  async getList(request: GetListMaintenanceAttributeRequestDto): Promise<any> {
    const { keyword, sort, filter, take, skip } = request;
    let filterObj = {};
    let sortObj = {};
    let keywordObj = {};
    let andArray = []

    if (!isEmpty(keyword)) {
      keywordObj = {
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
            andArray.push({
              code: {
                $regex: '.*' + value + '.*',
                $options: 'i',
              }
            })
            break;
          case 'name':
            andArray.push({
              name: {
                $regex: '.*' + value + '.*',
                $options: 'i',
              }
            })
            break;
          default:
            break;
        }
      });
    }
    if(andArray.length > 0) filterObj['$and'] = andArray
    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        switch (item.column) {
          case 'code':
            sortObj = { code: item.order };
            break;
          case 'name':
            sortObj = { name: item.order };
            break;
          case 'createdAt':
            sortObj = { createdAt: item.order };
            break;
          case 'updatedAt':
            sortObj = { updatedAt: item.order };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: 'DESC' };
    }
    const result = await this.maintenanceAttribute
      .find({ isDeleted: false })
      .find(filterObj)
      .find(keywordObj)
      .populate('histories')
      .limit(take)
      .skip(skip)
      .sort(sortObj)
      .exec();
    let total;
    if (isEmpty(Object.keys(keywordObj)) && isEmpty(Object.keys(filterObj))) {
      const data = await this.maintenanceAttribute.find({ isDeleted: false });
      total = data.length;
    } else {
      total = result.length;
    }
    return { result: result, count: total };
  }

  async update(param: any): Promise<any> {
    const result = await this.maintenanceAttribute
      .findByIdAndUpdate(param._id, {
        name: param.name,
        description: param.description,
      })
      .populate('histories');
    result.histories.push(param.history);
    return await result.save();
  }

  async findOneByCode(code: string): Promise<any> {
    const result = await this.maintenanceAttribute
      .findOne({ code: code })
      .populate('histories');
    return result;
  }

  async delete(id: string): Promise<any> {
    const result = await this.maintenanceAttribute.findByIdAndDelete(id);
    return result;
  }
}
