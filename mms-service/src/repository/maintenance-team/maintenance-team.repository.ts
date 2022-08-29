import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MaintenanceTeam } from '../../models/maintenance-team/maintenance-team.model';
import { MaintenanceTeamRepositoryInterface } from '@components/maintenance-team/interface/maintenance-team.repository.interface';
import { GetListMaintenaceTeamRequestDto } from '@components/maintenance-team/dto/request/get-list-maintenace-team.request.dto';
import { isEmpty } from 'lodash';
import { MAINTENANCE_TEAM_CONST } from '@components/maintenance-team/maintenance-team.constant';
import * as moment from 'moment';

@Injectable()
export class MaintenanceTeamRepository
  extends BaseAbstractRepository<MaintenanceTeam>
  implements MaintenanceTeamRepositoryInterface
{
  constructor(
    @InjectModel('MaintenanceTeam')
    private readonly maintenanceTeamModel: Model<MaintenanceTeam>,
  ) {
    super(maintenanceTeamModel);
  }

  async detail(id: string): Promise<any> {
    const result = await this.maintenanceTeamModel
      .findById(id)
      .populate('members')

      .lean();
    return result;
  }

  createDocument(param: any): MaintenanceTeam {
    const document = new this.maintenanceTeamModel();
    document.code = param.code;
    document.name = param.name;
    document.description = param.description;
    document.members = param.members;
    return document;
  }

  async getList(request: GetListMaintenaceTeamRequestDto): Promise<any> {
    const { keyword, sort, filter, take, skip } = request;
    let filterObj = {};
    let sortObj = {};
    const andArray = [];

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
            andArray.push({
              code: {
                $regex: '.*' + value + '.*',
                $options: 'i',
              },
            });
            break;
          case 'name':
            andArray.push({
              name: {
                $regex: '.*' + value + '.*',
                $options: 'i',
              },
            });
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
    if (andArray.length > 0) filterObj['$and'] = andArray;
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
    const result = await this.maintenanceTeamModel
      .find(filterObj)
      .populate('members')
      .limit(take)
      .skip(skip)
      .sort(sortObj)
      .exec();

    const total = await this.maintenanceTeamModel
      .find(filterObj)
      .countDocuments()
      .exec();
    return { result: result, count: total };
  }

  async update(param: any): Promise<any> {
    const result = await this.maintenanceTeamModel.findByIdAndUpdate(
      param._id,
      {
        name: param.name,
        type: param.type,
        description: param.description,
        members: param.members,
      },
    );

    return await result.save();
  }

  async findOneByUserId(id: number): Promise<MaintenanceTeam> {
    return (
      (await this.maintenanceTeamModel.findOne(
        {
          'members.userId': id,
          type: MAINTENANCE_TEAM_CONST.TYPE.EXTERNAL,
        },
        null,
        {
          sort: {
            createdAt: -1,
          },
        },
      )) ||
      (await this.maintenanceTeamModel.findOne(
        {
          'members.userId': id,
        },
        null,
        {
          sort: {
            createdAt: -1,
          },
        },
      ))
    );
  }

  async import(bulkOps: any): Promise<any> {
    return await this.maintenanceTeamModel.bulkWrite(bulkOps);
  }
}
