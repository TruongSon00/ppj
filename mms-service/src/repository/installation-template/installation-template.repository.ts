import { GetListInstallationTemplateQuery } from '@components/installation-template/dto/query/get-list-installation-template.query';
import { CreateInstallationTemplateRequest } from '@components/installation-template/dto/request/create-installation-template.request';
import { UpdateInstallationTemplateRequest } from '@components/installation-template/dto/request/update-installation-template.request';
import { LisInstallationTemplateResponse } from '@components/installation-template/dto/response/list-installation-template.response';
import { InstallationTemplateRepositoryInterface } from '@components/installation-template/interface/installation-template.repository';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { Model } from 'mongoose';
import {
  InstallationTemplate,
  InstallationTemplateDetail,
} from 'src/models/installation-template/installation-template.model';

@Injectable()
export class InstallationTemplateRepository
  extends BaseAbstractRepository<InstallationTemplate>
  implements InstallationTemplateRepositoryInterface
{
  constructor(
    @InjectModel('InstallationTemplate')
    private readonly installationTemplateModel: Model<InstallationTemplate>,
  ) {
    super(installationTemplateModel);
  }

  createDocument(
    request: CreateInstallationTemplateRequest,
  ): InstallationTemplate {
    const document = new this.installationTemplateModel();
    document.code = request.code;
    document.name = request.name;
    document.description = request.description;
    document.details = request.details.map((detail) => {
      const documentDetail = new InstallationTemplateDetail();
      documentDetail.title = detail.title;
      documentDetail.description = detail.description;
      documentDetail.isRequire = detail.isRequire;
      return documentDetail;
    });

    return document;
  }

  async updateDocument(
    request: UpdateInstallationTemplateRequest,
  ): Promise<InstallationTemplate> {
    return await this.installationTemplateModel.findByIdAndUpdate(
      request.id,
      request,
      {
        new: true,
      },
    );
  }

  updateEntity(entity: InstallationTemplate, request: any): InstallationTemplate {
    entity.name = request.name;
    entity.description = request.description;
    entity.details = request.details;
    return entity;
  }

  async list(
    request: GetListInstallationTemplateQuery,
  ): Promise<LisInstallationTemplateResponse> {
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
      sortObj = { createdAt: 'DESC' };
    }

    if (request.queryIds) {
      filterObj = {
        ...filterObj,
        id: {
          $in: request.queryIds,
        },
      };
    }

    const result = await this.installationTemplateModel
      .find({ deletedAt: null })
      .find(filterObj)
      .limit(take)
      .skip(skip)
      .sort(sortObj)
      .exec();
    const total: number = await this.installationTemplateModel
      .find({ deletedAt: null })
      .find(filterObj)
      .countDocuments()
      .exec();
    return { data: result, count: total };
  }
}
