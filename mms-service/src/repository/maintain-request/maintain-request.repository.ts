import { isEmpty } from 'lodash';
import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MaintainRequest } from 'src/models/maintain-request/maintain-request.model';
import { MaintainRequestRepositoryInterface } from '@components/maintain-request/interface/maintain-request.repository.interface';
import { CreateMaintainRequestDto } from '@components/maintain-request/dto/request/create-maintain-request.request.dto';
import { UpdateMaintainRequestDto } from '@components/maintain-request/dto/request/update-main-request.request.dto';
import { ListMaintainRequestDto } from '@components/maintain-request/dto/request/list-maintain-request.request.dto';
import * as mongoose from 'mongoose';
import { GetMaintainRequestByAssignDeviceRequest } from '@components/maintain-request/dto/request/get-maintain-request-by-assign-device.request.dto';
import * as moment from 'moment';
import {
  CODE_PREFIX_MAINTAIN_REQUEST,
  MAINTAIN_REQUEST_CODE_CONST,
  MAINTAIN_REQUEST_TYPE_ENUM,
} from '@components/maintain-request/maintain-request.constant';
import { generateCode } from 'src/helper/code.helper';

@Injectable()
export class MaintainRequestRepository
  extends BaseAbstractRepository<MaintainRequest>
  implements MaintainRequestRepositoryInterface
{
  constructor(
    @InjectModel('MaintainRequest')
    private readonly maintainRequestModel: Model<MaintainRequest>,
  ) {
    super(maintainRequestModel);
  }
  save(payload: CreateMaintainRequestDto): Promise<any> {
    throw new Error('Method not implemented.');
  }
  update(payload: UpdateMaintainRequestDto): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async getAll(params: ListMaintainRequestDto): Promise<any> {
    const { skip, take, keyword, filter, sort } = params;
    let sortObject = {};
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
    let filterObj = {};
    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'assignUserIds':
            filterObj = {
              ...filterObj,
              'deviceAssignment.device.responsibleUserId': {
                $in: item.text.split(',').map((i) => +i),
              },
            };
          case 'createdByUserIds':
            filterObj = {
              ...filterObj,
              userId: {
                $in: item.text.split(',').map((i) => +i),
              },
            };
            break;
          case 'status':
            filterObj = {
              ...filterObj,
              status: {
                $in: item.text.split(',').map((i) => +i),
              },
            };
          default:
            break;
        }
      });
    }
    if (!isEmpty(filterObj)) {
      condition['$and'] = [filterObj];
    }
    if (keyword) {
      const keywordFormated = keyword.trim();
      condition['$or'] = [
        { name: { $regex: `.*${keywordFormated}.*`, $options: 'i' } },
        { code: { $regex: `.*${keywordFormated}.*`, $options: 'i' } },
        {
          'deviceAssignment.serial': {
            $regex: `.*${keywordFormated}.*`,
            $options: 'i',
          },
        },
      ];
    }
    const facet = {
      $facet: {
        paginatedResults: [
          { $match: condition },
          { $sort: isEmpty(sort) ? { createdAt: -1 } : sortObject },
          { $skip: skip },
          { $limit: take },
        ],
        totalCount: [],
      },
    } as any;
    facet.$facet.totalCount.push({ $match: condition });

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
      {
        $lookup: {
          from: 'supplies',
          localField: 'supplies',
          foreignField: 'supplyId',
          as: 'supplies',
        },
      },
    ];

    query.push(facet);
    const result = await this.maintainRequestModel.aggregate(query);
    return {
      skip,
      take,
      total: result[0].totalCount.length || 0,
      data: result[0].paginatedResults || [],
    };
  }

  async getDetail(id: string): Promise<any> {
    const query = [
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
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
            {
              $lookup: {
                from: 'deviceRequestTickets',
                localField: 'deviceRequestId',
                foreignField: '_id',
                as: 'deviceRequest',
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: 'jobTypeId',
          as: 'job',
        },
      },
    ];
    const result = await this.maintainRequestModel.aggregate(query);
    return result;
  }

  async getMaintainRequestByAssignDevice(
    request: GetMaintainRequestByAssignDeviceRequest,
  ): Promise<{ data: any[]; total: number }> {
    this.maintainRequestModel.find();

    const data = await this.maintainRequestModel
      .find({ deviceAssignmentId: request.id })
      .limit(request.take)
      .skip(request.skip)
      .sort({
        createdAt: -1,
      })
      .exec();
    const total = await this.maintainRequestModel.count();

    return {
      data,
      total,
    };
  }

  reportMaintainRequest(startDate: Date, endDate: Date): Promise<any> {
    return this.maintainRequestModel
      .aggregate([
        {
          $match: {
            'histories.createdAt': {
              $gte: moment(startDate).startOf('day').toDate(),
              $lte: moment(endDate).endOf('day').toDate(),
            },
          },
        },
      ])
      .exec();
  }

  async createMaintenanceRequest(data: any) {
    if (!data?.code) {
      const latestObj: any =
        (await this.maintainRequestModel
          .findOne(null, null, {
            sort: {
              createdAt: -1,
            },
          })
          .exec()) ?? {};
      latestObj.code = latestObj?.code
        ? latestObj.code.replace(`${CODE_PREFIX_MAINTAIN_REQUEST}`, '')
        : MAINTAIN_REQUEST_CODE_CONST.DEFAULT_CODE;
      const code = generateCode(
        latestObj,
        MAINTAIN_REQUEST_CODE_CONST.DEFAULT_CODE,
        MAINTAIN_REQUEST_CODE_CONST.MAX_LENGTH,
        MAINTAIN_REQUEST_CODE_CONST.PAD_CHAR,
      );
      data.code = `${CODE_PREFIX_MAINTAIN_REQUEST}${code}`;
    }
    return await this.maintainRequestModel.create(data);
  }

  async dashboardMaintainRequest(startDate: Date, endDate: Date): Promise<any> {
    let condition: any = {
      type: {
        $in: [
          MAINTAIN_REQUEST_TYPE_ENUM.WARNING,
          MAINTAIN_REQUEST_TYPE_ENUM.USER_REQUEST,
        ],
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
}
