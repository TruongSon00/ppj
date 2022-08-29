import { Injectable } from '@nestjs/common';
import { Warning } from 'src/models/warning/warning.model';
import { WarningRepositoryInterface } from '@components/warning/interface/warning.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { GetListWarningRequestDto } from '@components/warning/dto/request/list-warning.request.dto';
import * as moment from 'moment';
import { isEmpty } from 'lodash';
import {
  WARNING_CODE_CONST,
  WARNING_CODE_PREFIX,
  WARNING_TYPE_ENUM,
} from '@components/warning/warning.constant';
import { generateCode, generateCodeByNumber } from 'src/helper/code.helper';
const ObjectId = mongoose.Types.ObjectId;
@Injectable()
export class WarningRepository
  extends BaseAbstractRepository<Warning>
  implements WarningRepositoryInterface
{
  constructor(
    @InjectModel('Warning')
    private readonly warningModel: Model<Warning>,
  ) {
    super(warningModel);
  }
  async findOneWithRelations(id: string): Promise<any> {
    const warning = await this.warningModel.aggregate([
      { $match: { _id: new ObjectId(`${id}`) } },
      {
        $lookup: {
          from: 'deviceAssignments',
          localField: 'deviceAssignmentId',
          foreignField: '_id',
          as: 'deviceAssignment',
          pipeline: [
            {
              $lookup: {
                from: 'devices',
                localField: 'deviceId',
                foreignField: '_id',
                as: 'device',
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'defects',
          localField: 'defectId',
          foreignField: '_id',
          as: 'defect',
        },
      },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: 'warningId',
          as: 'warningJob',
        },
      },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: 'checklistTemplateId',
          as: 'checklistJob',
        },
      },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: 'maintenancePeriodWarningId',
          as: 'maintenancePeriodJob',
        },
      },
    ]);
    return warning;
  }

  async dashboardWarning(startDate: Date, endDate: Date): Promise<any> {
    let condition: any = {
      type: {
        $in: [WARNING_TYPE_ENUM.WARNING, WARNING_TYPE_ENUM.USER_REQUEST],
      },
    };
    if (startDate && endDate) {
      condition = {
        ...condition,
        createdAt: {
          $gte: moment(startDate).startOf('day').toDate(),
          $lte: moment(endDate).endOf('day').toDate(),
        },
      };
    } else {
      condition = {
        ...condition,
        createdAt: {
          $lte: moment().endOf('day').toDate(),
        },
      };
    }
    return this.model
      .aggregate([
        {
          $match: condition,
        },
        {
          $group: {
            _id: {
              status: '$priority',
              id: '$_id',
            },
            date: {
              $first: '$createdAt',
            },
            count: { $count: {} },
          },
        },
      ])
      .exec();
  }

  async updateDetails(data): Promise<any> {
    const { checklistTemplateId, checkType, description, details } = data;
    const id = checklistTemplateId;
    const result = await this.model.findByIdAndUpdate(id, {
      checkType: checkType,
      description: description,
      details: details,
    });
    return result;
  }

  async getListWarning(payload: GetListWarningRequestDto): Promise<any> {
    const { page, limit, sort, filter } = payload;
    let keyword: string = payload.keyword;
    const pageIndex = +page || 1;
    const pageSize = +limit || 10;
    let sortObject = {};
    let filterObj = {};
    if (!isEmpty(sort)) {
      sortObject = sort.reduce((previousValue, currentValue) => {
        previousValue = {
          ...previousValue,
          ...{ [currentValue.column]: currentValue.order === 'DESC' ? -1 : 1 },
        };
        return previousValue;
      }, {});
    }
    const condition = {};
    if (keyword) {
      keyword = keyword.trim();
      condition['$or'] = [
        { name: { $regex: `.*${keyword}.*`, $options: 'i' } },
        {
          'deviceAssignment.serial': {
            $regex: `.*${keyword}.*`,
            $options: 'i',
          },
        },
        {
          'deviceAssignment.device.name': {
            $regex: `.*${keyword}.*`,
            $options: 'i',
          },
        },
        {
          code: {
            $regex: `.*${keyword}.*`,
            $options: 'i',
          },
        },
      ];
    }

    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'code':
            filterObj = {
              code: { $regex: '.*' + item.text + '.*', $options: 'i' },
            };
            break;
          case 'name':
            filterObj = {
              name: { $regex: '.*' + item.text + '.*', $options: 'i' },
            };
            break;
          case 'deviceName':
            filterObj = {
              'deviceAssignment.device.name': {
                $regex: '.*' + item.text + '.*',
                $options: 'i',
              },
            };
            break;
          case 'serial':
            filterObj = {
              'deviceAssignment.serial': {
                $regex: '.*' + item.text + '.*',
                $options: 'i',
              },
            };
            break;
          case 'type':
            filterObj = { ...filterObj, type: parseInt(item.text) };
            break;
          case 'status':
            filterObj = { ...filterObj, status: parseInt(item.text) };
            break;
          case 'priority':
            filterObj = { ...filterObj, priority: parseInt(item.text) };
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
    const facet = {
      $facet: {
        paginatedResults: [
          { $match: { ...condition, ...filterObj } },
          { $sort: isEmpty(sort) ? { code: -1 } : sortObject },
          { $skip: (pageIndex - 1) * pageSize },
          { $limit: pageSize },
        ],
        totalCount: [],
      },
    } as any;
    const query = [
      {
        $lookup: {
          from: 'deviceAssignments',
          localField: 'deviceAssignmentId',
          foreignField: '_id',
          as: 'deviceAssignment',
          pipeline: [
            {
              $lookup: {
                from: 'devices',
                localField: 'deviceId',
                foreignField: '_id',
                as: 'device',
              },
            },
          ],
        },
      },
    ];
    facet.$facet.totalCount.push({ $match: { ...condition, ...filterObj } });
    query.push(facet);
    const rs = await this.warningModel.aggregate(query);
    return {
      pageIndex,
      pageSize,
      total: rs[0].totalCount.length || 0,
      data: rs[0].paginatedResults || [],
    };
  }

  async createWarning(request: any): Promise<any> {
    if (!request?.code) {
      const latestObj: any =
        (await this.warningModel
          .findOne(null, null, {
            sort: {
              createdAt: -1,
            },
          })
          .exec()) ?? {};
      latestObj.code = latestObj?.code
        ? latestObj.code.replace(`${WARNING_CODE_PREFIX}`, '')
        : WARNING_CODE_CONST.DEFAULT_CODE;
      const code = generateCode(
        latestObj,
        WARNING_CODE_CONST.DEFAULT_CODE,
        WARNING_CODE_CONST.MAX_LENGTH,
        WARNING_CODE_CONST.PAD_CHAR,
      );
      request.code = `${WARNING_CODE_PREFIX}${code}`;
    }
    return await this.model.create(request);
  }

  async createManyWarning(request: any): Promise<any> {
    const latestObj: any =
      (await this.warningModel
        .findOne(null, null, {
          sort: {
            createdAt: -1,
          },
        })
        .exec()) ?? {};
    latestObj.code = latestObj?.code
      ? latestObj?.code.replace(`${WARNING_CODE_PREFIX}`, '')
      : WARNING_CODE_CONST.DEFAULT_CODE;
    const code = +latestObj.code;
    const data = request.map((item, index) => {
      if (!item.code) {
        const itemCode = generateCodeByNumber(
          code + index,
          WARNING_CODE_CONST.DEFAULT_CODE,
          WARNING_CODE_CONST.MAX_LENGTH,
          WARNING_CODE_CONST.PAD_CHAR,
        );
        item.code = `${WARNING_CODE_PREFIX}${itemCode}`;
      }
      return item;
    });
    return await this.model.insertMany(data);
  }
}
