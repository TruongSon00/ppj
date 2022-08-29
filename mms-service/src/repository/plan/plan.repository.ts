import { CreatePlanRequestDto } from '@components/plan/dto/request/create-plan.request.dto';
import { GetListPlanRequestDto } from '@components/plan/dto/request/get-list-plan.request.dto';
import { PlanRepositoryInterface } from '@components/plan/interface/plan.repository.interface';
import { PLAN_STATUS_ENUM } from '@components/plan/plan.constant';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'lodash';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { DetailPlanRequestDto } from '@components/plan/dto/request/get-plan-detail.request.dto';
import { JobTypeTotal, Plan } from 'src/models/plan/plan.model';
import { GanttChartPlanQuery } from '@components/plan/dto/query/gantt-chart-plan.query';
import * as moment from 'moment';

@Injectable()
export class PlanRepository
  extends BaseAbstractRepository<Plan>
  implements PlanRepositoryInterface
{
  constructor(
    @InjectModel('Plan')
    private readonly planModel: Model<Plan>,
  ) {
    super(planModel);
  }
  async getList(request: GetListPlanRequestDto): Promise<any> {
    const { keyword, sort, filter, take, page} = request;
    const pageIndex = +page || 1;
    const pageSize = +take || 10;
    let filterObj = {};
    let sortObj = {};

    if (!isEmpty(keyword)) {
      filterObj = {
        $or: [
          { code: { $regex: '.*' + keyword + '.*', $options: 'i' } },
          { name: { $regex: '.*' + keyword + '.*', $options: 'i' } },
          // TODO: add filter by serial number
        ],
      };
    }

    if (!isEmpty(filter)) {
      const typeGet = filter.find(type => type.column === 'typeGet')
      filter.forEach((item) => {
        switch (item.column) {
          case 'code':
            filterObj = {
              ...filterObj,
              code: {
                $regex: '.*' + item.text + '.*',
                $options: 'i',
              },
            };
            break;
          case 'name':
            filterObj = {
              ...filterObj,
              name: {
                $regex: '.*' + item.text + '.*',
                $options: 'i',
              },
            };
            break;
          case 'status':
            filterObj = { ...filterObj, status: parseInt(item.text) };
            break;
          case 'time':
            if(!typeGet){
              filterObj = {
                ...filterObj,
                planFrom: {
                  $lte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                },
                planTo: {
                  $gte: moment(item.text.split('|')[1]).endOf('day').toDate(),
                },
              };
            }else if(Number(typeGet.text) === 1){
              filterObj = {
                ...filterObj,
                planFrom: {
                  $gte: moment(item.text.split('|')[0]).startOf('day').toDate(),
                },
                planTo: {
                  $lte: moment(item.text.split('|')[1]).endOf('day').toDate(),
                },
              };
            }
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
        const sort = item.order == 'DESC' ? -1 : 1;
        switch (item.column) {
          case 'code':
            sortObj = { ...sortObj, code: sort };
            break;
          case 'name':
            sortObj = { ...sortObj, name: sort };
            break;
          case 'jobPlanTotal':
            sortObj = { ...sortObj, jobPlanTotal: sort };
            break;
          case 'jobExecutionTotal':
            sortObj = { ...sortObj, jobExecutionTotal: sort };
            break;
          case 'status':
            sortObj = { ...sortObj, status: sort };
            break;
          case 'planFrom':
            sortObj = { ...sortObj, planFrom: sort };
            break;
          case 'planTo':
            sortObj = { ...sortObj, planTo: sort };
            break;
          case 'createdAt':
            sortObj = { ...sortObj, createdAt: sort };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: -1 };
    }

    const query = [
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: 'planId',
          as: 'job',
          pipeline: [
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $project: {
          code: 1,
          name: 1,
          planFrom: 1,
          planTo: 1,
          status: 1,
          createdAt: 1,
          jobPlanTotal: {
            $add: [
              '$jobTypeTotal.warningTotal',
              '$jobTypeTotal.maintainRequestTotal',
              '$jobTypeTotal.maintainPeriodWarningTotal',
              '$jobTypeTotal.checklistTemplateTotal',
              '$jobTypeTotal.installingTotal',
            ],
          },
          jobExecutionTotal: '$job.count',
        },
      },
      {
        $unwind: {
          path: '$jobExecutionTotal',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          ...filterObj,
        },
      },
      {
        $sort: sortObj,
      },
      {
        $facet: {
          paginatedResults: [
            { $skip: (pageIndex - 1) * pageSize },
            { $limit: pageSize },
          ],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ];

    const result = await this.planModel.aggregate(query);

    return {
      result: result[0].paginatedResults,
      count: result[0]?.totalCount[0]?.count || 0,
      pageIndex,
      pageSize,
    };
  }

  async getDetail(request: DetailPlanRequestDto, id: number): Promise<any> {
    const { filter, take, page } = request;
    const pageIndex = +page || 1;
    const pageSize = +take || 10;
    let filterObj = {};
    let permission = {};
    if (id)
      permission = {
        assignUsers: {
          $elemMatch: {
            userId: id,
          },
        },
      };
    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'code':
            filterObj = {
              ...filterObj,
              code: {
                $regex: '.*' + item.text + '.*',
                $options: 'i',
              },
            };
            break;
          case 'name':
            filterObj = {
              ...filterObj,
              name: {
                $regex: '.*' + item.text + '.*',
                $options: 'i',
              },
            };
            break;
          case 'serial':
            filterObj = {
              ...filterObj,
              'deviceAssignment.serial': {
                $regex: '.*' + item.text + '.*',
                $options: 'i',
              },
            };
            break;
          case 'nameDevice':
            filterObj = {
              ...filterObj,
              'deviceAssignment.device.name': {
                $regex: '.*' + item.text + '.*',
                $options: 'i',
              },
            };
            break;
          case 'status':
            filterObj = { ...filterObj, status: parseInt(item.text) };
            break;
          case 'type':
            filterObj = { ...filterObj, type: parseInt(item.text) };
            break;
          case 'planFrom':
            filterObj = {
              ...filterObj,
              planFrom: {
                $gte: moment(item.text).startOf('day').toDate(),
              },
            };
            break;
          case 'planTo':
            filterObj = {
              ...filterObj,
              planTo: {
                $lte: moment(item.text).endOf('day').toDate(),
              },
            };
            break;
          case 'executionDateFrom':
            filterObj = {
              ...filterObj,
              executionDateFrom: {
                $gte: moment(item.text).startOf('day').toDate(),
              },
            };
            break;
          case 'executionDateTo':
            filterObj = {
              ...filterObj,
              executionDateTo: {
                $lte: moment(item.text).endOf('day').toDate(),
              },
            };
            break;
          default:
            break;
        }
      });
    }
    const query = [
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: 'planId',
          as: 'jobs',
          pipeline: [
            { $match: { ...permission, ...filterObj } },
            { $sort: { createdAt: -1 } },
            {
              $lookup: {
                from: 'maintainRequests',
                localField: 'maintainRequestId',
                foreignField: '_id',
                as: 'maintenanceRequest',
                pipeline: [
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
                        { $unwind: '$device' },
                      ],
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: 'warnings',
                localField: 'maintenancePeriodWarningId',
                foreignField: '_id',
                as: 'maintenancePeriodWarning',
                pipeline: [
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
                        { $unwind: '$device' },
                      ],
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: 'warnings',
                localField: 'checklistTemplateId',
                foreignField: '_id',
                as: 'checklistWarning',
                pipeline: [
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
                        { $unwind: '$device' },
                      ],
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: 'warnings',
                localField: 'warningId',
                foreignField: '_id',
                as: 'errorWarning',
                pipeline: [
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
                        { $unwind: '$device' },
                      ],
                    },
                  },
                ],
              },
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
                  { $unwind: '$device' },
                ],
              },
            },
            {
              $unwind: {
                path: '$deviceAssignment',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $facet: {
                paginatedResults: [
                  { $skip: (pageIndex - 1) * pageSize },
                  { $limit: pageSize },
                ],
                totalCount: [
                  {
                    $count: 'count',
                  },
                ],
              },
            },
          ],
        },
      },
      {
        $match: {
          _id: new mongoose.Types.ObjectId(request.id),
          deletedAt: null,
        },
      },
    ];
    const rs = await this.planModel.aggregate(query);
    return {
      planDetail: rs,
      pageIndex,
      pageSize,
    };
  }

  createDocument(request: CreatePlanRequestDto): Plan {
    const document = new this.planModel();
    document.code = request.code;
    document.name = request.name;
    document.status = PLAN_STATUS_ENUM.WAITING_TO_CONFIRMED;
    document.planFrom = request.planFrom;
    document.planTo = request.planTo;
    document.factoryId = request.factoryId;
    document.workCenterId = request.workCenterId;
    document.createdBy = request.user.id;
    document.jobTypeTotal = new JobTypeTotal();
    document.jobTypeTotal.checklistTemplateTotal =
      request.jobTypeTotal.checklistTemplateTotal;
    document.jobTypeTotal.installingTotal =
      request.jobTypeTotal.installingTotal;
    document.jobTypeTotal.maintainPeriodWarningTotal =
      request.jobTypeTotal.maintainPeriodWarningTotal;
    document.jobTypeTotal.maintainRequestTotal =
      request.jobTypeTotal.maintainRequestTotal;
    document.jobTypeTotal.warningTotal = request.jobTypeTotal.warningTotal;

    return document;
  }

  async checkPlanDate(
    planFrom: Date,
    planTo: Date,
    id?: string,
    factoryId?: number,
    workCenterId?: number,
  ): Promise<any> {
    let filterObj = {};
    if (id)
      filterObj = {
        _id: { $ne: id },
      };
    const rs = await this.planModel.find({
      $or: [
        {
          planFrom: {
            $gte: planFrom,
            $lte: planTo,
          },
        },
        {
          planTo: {
            $gte: planFrom,
            $lte: planTo,
          },
        },
      ],
      factoryId,
      workCenterId,
      ...filterObj,
      deletedAt: null,
      status: PLAN_STATUS_ENUM.CONFIRMED,
    });
    return rs;
  }

  async ganttChart(request: GanttChartPlanQuery): Promise<any[]> {
    return this.planModel.aggregate([
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: 'planId',
          as: 'jobs',
          pipeline: [
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
          ],
        },
      },
    ]);
  }
}
