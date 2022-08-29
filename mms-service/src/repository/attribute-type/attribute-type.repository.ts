import { GetListAttributeTypeQuery } from '@components/attribute-type/dto/request/get-list-attribute-type.query';
import { CreateAttributeTypeRequest } from '@components/attribute-type/dto/request/create-attribute-type.request';
import { ListAttributeTypeResponse } from '@components/attribute-type/dto/response/list-attribute-type.response';
import { AttributeTypeRepositoryInterface } from '@components/attribute-type/interface/attribute-type.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { AttributeType } from 'src/models/attribute-type/attribute-type.model';
import { UpdateAttributeTypeBodyDto } from '@components/attribute-type/dto/request/update-attribute-type.request';

@Injectable()
export class AttributeTypeRepository
  extends BaseAbstractRepository<AttributeType>
  implements AttributeTypeRepositoryInterface
{
  constructor(
    @InjectModel('AttributeType')
    private readonly attributeTypeModel: Model<AttributeType>,
  ) {
    super(attributeTypeModel);
  }

  createEntity(request: CreateAttributeTypeRequest): AttributeType {
    const document = new this.attributeTypeModel();
    document.code = request.code;
    document.name = request.name;
    document.description = request.description;
    document.unit = request.unit;

    return document;
  }

  updateEntity(
    entity: AttributeType,
    request: UpdateAttributeTypeBodyDto,
  ): AttributeType {
    entity.name = request.name;
    entity.description = request.description;
    entity.unit = request.unit;
    return entity;
  }

  async list(
    request: GetListAttributeTypeQuery,
  ): Promise<ListAttributeTypeResponse> {
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
          case 'unit':
            filterObj = {
              ...filterObj,
              'unitObject._id': item.text,
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
          case 'unit':
            sortObj = { 'unitObject.name': order };
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

    filterObj = {
      ...filterObj,
      deletedAt: null,
    };
    const result: any = await this.attributeTypeModel
      .find(filterObj)
      .sort(sortObj)
      .populate({
        path: 'unit',
      })
      .limit(take)
      .skip(skip)
      .exec();

    const count = await this.attributeTypeModel
      .find({
        deletedAt: null,
        ...filterObj,
      })
      .countDocuments()
      .exec();

    return {
      data: result,
      count,
    };
  }
}
