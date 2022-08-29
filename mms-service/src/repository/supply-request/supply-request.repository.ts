import { I18nRequestScopeService } from 'nestjs-i18n';
import { ListSupplyRequestQuery } from '@components/supply-request/dto/query/list-supply-request.query';
import { CreateSupplyRequest } from '@components/supply-request/dto/request/create-supply-request.request';
import { DetailSupplyRequestRequest } from '@components/supply-request/dto/request/detail-supply-request.request';
import { SupplyRequestRepositoryInterface } from '@components/supply-request/interface/supply-request.repository.interface';
import {
  SUPPLY_REQUEST_CODE_CONST,
  SUPPLY_REQUEST_CODE_PREFIX,
  SUPPLY_REQUEST_NAME_DEFAULT,
} from '@components/supply-request/supply-request.constant';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'lodash';
import { Model } from 'mongoose';
import { generateCode } from 'src/helper/code.helper';
import {
  SupplyRequest,
  RequestedBy,
  SupplyRequestDetail,
} from 'src/models/supply-request/supply-request.model';
import * as moment from 'moment';

@Injectable()
export class SupplyRequestRepository
  extends BaseAbstractRepository<SupplyRequest>
  implements SupplyRequestRepositoryInterface
{
  constructor(
    @InjectModel('SupplyRequest')
    private readonly supplyRequestModel: Model<SupplyRequest>,

    private readonly i18n: I18nRequestScopeService,
  ) {
    super(supplyRequestModel);
  }

  async createDocument(
    request: CreateSupplyRequest,
    type: number,
    deviceAssignmentId: string,
    isManufacture: boolean,
    teamId: string,
  ): Promise<SupplyRequest> {
    const latestObj: any =
      (await this.supplyRequestModel
        .findOne(null, null, {
          sort: {
            createdAt: -1,
          },
        })
        .exec()) ?? {};
    latestObj.code = latestObj?.code
      ? latestObj.code.replace(`${SUPPLY_REQUEST_CODE_PREFIX}`, '')
      : SUPPLY_REQUEST_CODE_CONST.DEFAULT_CODE;
    const code = generateCode(
      latestObj,
      SUPPLY_REQUEST_CODE_CONST.DEFAULT_CODE,
      SUPPLY_REQUEST_CODE_CONST.MAX_LENGTH,
      SUPPLY_REQUEST_CODE_CONST.PAD_CHAR,
    );
    const requestCode = request.code || `${SUPPLY_REQUEST_CODE_PREFIX}${code}`;
    const defaultName = await this.i18n.translate(SUPPLY_REQUEST_NAME_DEFAULT);
    const requestName =
      request.name ||
      defaultName.replace('{code}', request.code || requestCode);

    const document = new this.supplyRequestModel();
    document.code = requestCode;
    document.name = requestName;
    document.description = request.description;
    document.receiveExpectedDate = request.receiveExpectedDate;
    document.type = type;
    document.jobId = request.jobId;
    document.deviceAssignmentId = deviceAssignmentId;
    document.requestedBy = new RequestedBy();
    document.requestedBy.userId = request.user.id;
    document.requestedBy.teamId = teamId;
    document.supplies = request.supplies.map((e) => {
      const supplyRequestDetail = new SupplyRequestDetail();
      supplyRequestDetail.supplyId = e.supplyId;
      supplyRequestDetail.quantity = e.quantity;
      supplyRequestDetail.isManufacture = isManufacture;
      return supplyRequestDetail;
    });

    return document;
  }

  async list(request: ListSupplyRequestQuery): Promise<any> {
    const { keyword, sort, filter, take, skip } = request;

    let filterObj: any = {
      deletedAt: null,
    };

    let sortObj = {};

    if (!isEmpty(keyword)) {
      filterObj = {
        ...filterObj,
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
          case 'jobId':
            filterObj = {
              ...filterObj,
              jobId: value,
            };
            break;
          case 'status':
            filterObj = { ...filterObj, status: parseInt(item.text) };
            break;
          case 'type':
            filterObj = { ...filterObj, type: parseInt(item.text) };
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
          case 'createdByUserIds':
            filterObj = {
              ...filterObj,
              'requestedBy.userId': parseInt(item.text),
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
          case 'status':
            sortObj = { status: order };
            break;
          case 'type':
            sortObj = { type: order };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: 'DESC' };
    }

    const result: any = await this.supplyRequestModel
      .find(filterObj)
      .populate({
        path: 'deviceAssignmentId',
        populate: {
          path: 'deviceId',
        },
      })
      .populate({
        path: 'supplies.supplyId',
      })
      .limit(take)
      .skip(skip)
      .sort(sortObj)
      .exec();
    const total: number = await this.supplyRequestModel
      .find({ deletedAt: null })
      .find(filterObj)
      .countDocuments()
      .exec();
    return { data: result, count: total };
  }

  findAllWithPopulate(condition: any, populate: any): Promise<SupplyRequest[]> {
    return this.supplyRequestModel
      .find(condition)
      .populate(populate)
      .populate({
        path: 'supplies.supplyId',
      })
      .exec();
  }

  detail(request: DetailSupplyRequestRequest): Promise<any> {
    return this.supplyRequestModel
      .findOne({
        _id: request.id,
        deletedAt: null,
      })
      .populate({
        path: 'deviceAssignmentId',
        populate: {
          path: 'deviceId',
        },
      })
      .populate({
        path: 'supplies.supplyId',
      })
      .populate({
        path: 'jobId',
      })
      .exec();
  }
}
