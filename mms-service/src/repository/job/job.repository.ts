import { Injectable } from '@nestjs/common';
import { Job } from 'src/models/job/job.model';
import { JobRepositoryInterface } from '@components/job/interface/job.repository.interface';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { isEmpty } from 'lodash';
import { GetListJobRequestDto } from '@components/job/dto/request/get-list-job.request.dto';
import {
  checklistConcludeEnum,
  JOB_CODE_CONST,
  JOB_CODE_PREFIX,
  JOB_STATUS_ENUM,
  JOB_TYPE_ENUM,
  JOB_TYPE_MAINTENANCE_ENUM,
} from '@components/job/job.constant';
import { ChecklistJobRequestDto } from '@components/job/dto/request/checklist-job.request.dto';
import * as mongoose from 'mongoose';
import { JobRejectRequestDto } from '@components/job/dto/request/reject-job.request.dto';
import { JobImplementRequestDto } from '@components/job/dto/request/implement-job.request.dto';
import { ListJobByDeviceRequestDto } from '@components/job/dto/request/list-job-by-device.request.dto';
import { ApproveJobRequestDto } from '@components/job/dto/request/approve-job.request.dto';
import { RedoJobRequestDto } from '@components/job/dto/request/redo-check-list.request.dto';
import * as moment from 'moment';
import { ListJobProgressRequestDto } from '@components/job/dto/request/report-job-progress-list.request.dto';
import { generateCode } from 'src/helper/code.helper';
import { Types } from 'mongoose';
import { PLAN_STATUS_ENUM } from '@components/plan/plan.constant';
import { convertOrderMongo } from '@utils/common';
import { ReportJobRequest } from '@components/job/dto/request/report-job.request.dto';
import { GetListJobByPlanIdRequestDto } from '@components/job/dto/request/get-list-job-in-plan.request';
import { ObjectID } from 'bson';
mongoose.set('debug', true);
@Injectable()
export class JobRepository
  extends BaseAbstractRepository<Job>
  implements JobRepositoryInterface
{
  constructor(
    @InjectModel('Job')
    private readonly jobModel: Model<Job>,
  ) {
    super(jobModel);
  }

  async createManyJobEntity(data: any): Promise<any> {
    const latestObj: any =
      (await this.jobModel
        .findOne(null, null, {
          sort: {
            createdAt: -1,
          },
        })
        .exec()) ?? {};

    const document = data.map((item, index) => {
      latestObj.code = latestObj?.code
        ? +latestObj?.code.replace(`${JOB_CODE_PREFIX}`, '') + index
        : JOB_CODE_CONST.DEFAULT_CODE;
      if (!item.code) {
        const itemCode = generateCode(
          latestObj,
          JOB_CODE_CONST.DEFAULT_CODE,
          JOB_CODE_CONST.MAX_LENGTH,
          JOB_CODE_CONST.PAD_CHAR,
        );
        item.code = `${JOB_CODE_PREFIX}${itemCode}`;
      }
      return item;
    });
    return await this.model.insertMany(document);
  }

  async createJobEntity(data: any, getData = false): Promise<any> {
    if (!data?.code) {
      const latestObj: any =
        (await this.jobModel
          .findOne(null, null, {
            sort: {
              createdAt: -1,
            },
          })
          .exec()) ?? {};
      latestObj.code = latestObj?.code
        ? latestObj.code.replace(`${JOB_CODE_PREFIX}`, '')
        : JOB_CODE_CONST.DEFAULT_CODE;
      const code = generateCode(
        latestObj,
        JOB_CODE_CONST.DEFAULT_CODE,
        JOB_CODE_CONST.MAX_LENGTH,
        JOB_CODE_CONST.PAD_CHAR,
      );
      data.code = `${JOB_CODE_PREFIX}${code}`;
    }
    return getData ? data : await this.jobModel.create(data);
  }

  async getListJob(
    payload: GetListJobRequestDto,
    checkPermission,
    userIdsInTeam: string[],
    userIdsFilter: string[],
    isTeamLead?: boolean,
    teamId?: string,
  ): Promise<any> {
    const { filter, curUser, page, limit, sort } = payload;
    let keyword: string = payload.keyword;
    let isFilterAssign = false;
    const pageIndex = +page || 1;
    const pageSize = +limit || 10;
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
    let keywordObj = {};
    let filterObj = {} as any;
    if (!isEmpty(filter)) {
      filter.forEach((item) => {
        switch (item.column) {
          case 'status':
            filterObj = {
              ...filterObj,
              status: {
                $in: item.text.split(',').map((i) => +i),
              },
            };
            break;
          case 'type':
            const type = [];
            item.text.split(',').forEach((i) => {
              type.push(+i);
            });
            filterObj = {
              ...filterObj,
              type: {
                $in: type,
              },
            };
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
          case 'serial':
            filterObj = {
              ...filterObj,
              'deviceAssignment.serial': {
                $regex: `.*${item.text}.*`,
                $options: 'i',
              },
            };
            break;
          case 'deviceName':
            filterObj = {
              ...filterObj,
              'deviceAssignment.device.name': {
                $regex: `.*${item.text}.*`,
                $options: 'i',
              },
            };
            break;
          case 'requestName':
            filterObj = {
              ...filterObj,
              $or: [
                {
                  'maintainRequest.name': {
                    $regex: `.*${item.text}.*`,
                    $options: 'i',
                  },
                },
                {
                  'checklistTemplate.name': {
                    $regex: `.*${item.text}.*`,
                    $options: 'i',
                  },
                },
                {
                  'installationTemplate.name': {
                    $regex: `.*${item.text}.*`,
                    $options: 'i',
                  },
                },
                {
                  'warning.name': {
                    $regex: `.*${item.text}.*`,
                    $options: 'i',
                  },
                },
                {
                  'maintenancePeriodWarning.name': {
                    $regex: `.*${item.text}.*`,
                    $options: 'i',
                  },
                },
                {
                  name: {
                    $regex: `.*${item.text}.*`,
                    $options: 'i',
                  },
                },
              ],
            };
            break;
          case 'requestCode':
            filterObj = {
              ...filterObj,
              $or: [
                {
                  'maintainRequest.code': {
                    $regex: `.*${item.text}.*`,
                    $options: 'i',
                  },
                },
                {
                  'checklistTemplate.code': {
                    $regex: `.*${item.text}.*`,
                    $options: 'i',
                  },
                },
                {
                  'installationTemplate.code': {
                    $regex: `.*${item.text}.*`,
                    $options: 'i',
                  },
                },
                {
                  'warning.code': {
                    $regex: `.*${item.text}.*`,
                    $options: 'i',
                  },
                },
                {
                  'maintenancePeriodWarning.code': {
                    $regex: `.*${item.text}.*`,
                    $options: 'i',
                  },
                },
              ],
            };
            break;
          case 'code':
            filterObj = {
              ...filterObj,
              $or: [
                {
                  'maintainRequest.code': {
                    $regex: `.*${item.text}.*`,
                    $options: 'i',
                  },
                },
                {
                  'checklistTemplate.code': {
                    $regex: `.*${item.text}.*`,
                    $options: 'i',
                  },
                },
                {
                  'installationTemplate.code': {
                    $regex: `.*${item.text}.*`,
                    $options: 'i',
                  },
                },
                {
                  'warning.code': {
                    $regex: `.*${item.text}.*`,
                    $options: 'i',
                  },
                },
                {
                  'maintenancePeriodWarning.code': {
                    $regex: `.*${item.text}.*`,
                    $options: 'i',
                  },
                },
                {
                  code: {
                    $regex: `.*${item.text}.*`,
                    $options: 'i',
                  },
                },
              ],
            };
            break;
          case 'user':
            isFilterAssign = true;
            filterObj = {
              ...filterObj,
              assign: {
                $elemMatch: {
                  $or: [
                    {
                      assignId: {
                        $in: isFilterAssign
                          ? userIdsFilter
                          : [...userIdsInTeam, ...userIdsFilter],
                      },
                    },
                    { assignId: item.text },
                  ],
                },
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
    if (!isEmpty(filterObj)) {
      condition['$and'] = [filterObj];
    }
    if (keyword) {
      keyword = keyword.trim();
      keywordObj = {
        $or: [
          {
            code: { $regex: `.*${keyword}.*`, $options: 'i' },
          },
          {
            'deviceAssignment.serial': {
              $regex: `.*${keyword}.*`,
              $options: 'i',
            },
          },
        ],
      };
    }

    const conditionOr = condition['$or'] ? condition['$or'] : [];

    condition['$or'] = [
      ...conditionOr,
      {
        'plan.status': PLAN_STATUS_ENUM.CONFIRMED,
      },
      { planId: null },
    ];

    let conditionPermission: any = {};
    //@TODO: check user role / department
    if (!checkPermission || curUser) {
      if (isTeamLead)
        conditionPermission = {
          'assign.assignId': {
            $in: isFilterAssign
              ? userIdsFilter
              : [...userIdsInTeam, ...userIdsFilter],
          },
        };
      else
        conditionPermission = {
          'assign.assignId': {
            $in: [payload.userInfo.id.toString(), teamId, ...userIdsInTeam],
          },
        };
    }

    const facet = {
      $facet: {
        paginatedResults: [
          {
            $match: {
              ...conditionPermission,
              ...condition,
              deletedAt: null,
              ...keywordObj,
            },
          },
          { $sort: isEmpty(sort) ? { createdAt: -1 } : sortObject },
          { $skip: (pageIndex - 1) * pageSize },
          { $limit: pageSize },
        ],
        totalCount: [],
      },
    } as any;

    const query = [
      {
        $lookup: {
          from: 'warnings',
          localField: 'jobTypeId',
          foreignField: '_id',
          as: 'warning',
          let: { type: '$type' },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$$type', JOB_TYPE_ENUM.WARNING] } },
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
                      from: 'checklistTemplates',
                      localField: 'deviceId',
                      foreignField: 'deviceId',
                      as: 'checkListTemplate',
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'maintainRequests',
          localField: 'jobTypeId',
          foreignField: '_id',
          as: 'maintainRequest',
          let: { type: '$type' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$$type', JOB_TYPE_ENUM.MAINTENANCE_REQUEST] },
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
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'warnings',
          localField: 'jobTypeId',
          foreignField: '_id',
          as: 'checklistTemplate',
          let: { type: '$type' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$$type', JOB_TYPE_ENUM.PERIOD_CHECKLIST] },
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
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'warnings',
          localField: 'jobTypeId',
          foreignField: '_id',
          as: 'maintenancePeriodWarning',
          let: { type: '$type' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$$type', JOB_TYPE_ENUM.PERIOD_MAINTAIN] },
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
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'installationTemplates',
          localField: 'jobTypeId',
          foreignField: '_id',
          as: 'installationTemplate',
          let: { type: '$type' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$$type', JOB_TYPE_ENUM.INSTALLATION] },
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
          ],
        },
      },
      {
        $lookup: {
          from: 'plans',
          localField: 'planId',
          foreignField: '_id',
          as: 'plan',
        },
      },
    ];
    facet.$facet.totalCount.push({
      $match: { ...conditionPermission, ...condition, ...keywordObj },
    });
    query.push(facet);
    const rs = await this.jobModel.aggregate(query);

    return {
      pageIndex,
      pageSize,
      total: rs[0].totalCount.length || 0,
      data: rs[0].paginatedResults || [],
    };
  }

  async updateJobAssignment(data: any): Promise<any> {
    const { id, planTo, planFrom, history, planId, assign } = data;

    const result = await this.model.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        assign,
        planTo,
        planFrom,
        planId,
        status: JOB_STATUS_ENUM.WAITING_TO_CONFIRMED,
        $push: { histories: history },
      },
    );
    return result;
  }

  async updateJobReject(data: JobRejectRequestDto): Promise<any> {
    const { id, history } = data;
    const result = await this.model.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        status: JOB_STATUS_ENUM.REJECTED,
        $push: { histories: history },
      },
    );
    return result;
  }

  async updateJobImplement(data: JobImplementRequestDto): Promise<any> {
    const { id, history } = data;
    const result = await this.model.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        status: JOB_STATUS_ENUM.TO_DO,
        $push: { histories: history },
      },
    );
    return result;
  }

  async updateJobExecute(job, data: any): Promise<any> {
    const {
      description,
      executionDateFrom,
      executionDateTo,
      executionTime,
      id,
      maintenanceType,
      history,
      supplies,
      result,
      details,
    } = data;
    let fieldToUpdate: any = {};
    if (
      job.type === JOB_TYPE_ENUM.MAINTENANCE_REQUEST ||
      job.type === JOB_TYPE_ENUM.WARNING ||
      job.type === JOB_TYPE_ENUM.PERIOD_MAINTAIN
    ) {
      fieldToUpdate = {
        description: description,
        executionDateFrom: executionDateFrom,
        executionDateTo: executionDateTo,
        status: JOB_STATUS_ENUM.COMPLETED,
        result: { maintenanceType },
        $push: { histories: history },
      };

      if (supplies?.length) {
        const suppliesList = supplies.map((supply) => ({
          ...supply,
          maintenanceType: supply.maintainType,
        }));

        fieldToUpdate = {
          ...fieldToUpdate,
          actualSupplies: suppliesList,
        };
      }
    }

    if (job.type === JOB_TYPE_ENUM.INSTALLATION) {
      fieldToUpdate = {
        description: description,
        executionDateFrom: executionDateFrom,
        executionDateTo: executionDateTo,
        executionTime: executionTime,
        status: JOB_STATUS_ENUM.COMPLETED,
        result: {
          installResult: result,
          details: details.map((data) => ({
            ...data,
            title: data.title || data.name,
          })),
        },
        $push: { histories: history },
      };
    }
    const res = await this.model.findByIdAndUpdate(
      {
        _id: id,
      },
      fieldToUpdate,
    );
    return res;
  }

  async getDetailJob(id: string): Promise<any> {
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
          from: 'installationTemplates',
          localField: 'jobTypeId',
          foreignField: '_id',
          as: 'installationTemplate',
          let: { type: '$type' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$$type', JOB_TYPE_ENUM.INSTALLATION] },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'warnings',
          localField: 'jobTypeId',
          foreignField: '_id',
          as: 'warning',
          let: { type: '$type' },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$$type', JOB_TYPE_ENUM.WARNING] } },
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
          ],
        },
      },
      {
        $lookup: {
          from: 'maintainRequests',
          localField: 'jobTypeId',
          foreignField: '_id',
          as: 'maintainRequest',
          let: { type: '$type' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$$type', JOB_TYPE_ENUM.MAINTENANCE_REQUEST] },
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
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'warnings',
          localField: 'jobTypeId',
          foreignField: '_id',
          as: 'checklistTemplate',
          let: { type: '$type' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$$type', JOB_TYPE_ENUM.PERIOD_CHECKLIST] },
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
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'warnings',
          localField: 'jobTypeId',
          foreignField: '_id',
          as: 'maintenancePeriodWarning',
          let: { type: '$type' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$$type', JOB_TYPE_ENUM.PERIOD_MAINTAIN] },
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
                ],
              },
            },
            {
              $lookup: {
                from: 'supplies',
                localField: 'supplyId',
                foreignField: '_id',
                as: 'supply',
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'plans',
          localField: 'planId',
          foreignField: '_id',
          as: 'plan',
        },
      },
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
    ];
    const rs = await this.jobModel.aggregate(query);
    return rs;
  }

  async updateJobChecklist(data: ChecklistJobRequestDto): Promise<any> {
    const {
      executionDateFrom,
      executionDateTo,
      id,
      checklistConclude,
      checklistResult,
    } = data;
    const maintenanceType =
      checklistConclude === checklistConcludeEnum.MAINTAIN
        ? JOB_TYPE_MAINTENANCE_ENUM.MAINTENANCE
        : JOB_TYPE_MAINTENANCE_ENUM.REPLACE;
    const result = await this.model.findByIdAndUpdate(id, {
      executionDateFrom: executionDateFrom,
      executionDateTo: executionDateTo,
      status: JOB_STATUS_ENUM.COMPLETED,
      result: {
        maintenanceType: maintenanceType,
        checklist: {
          conclude: checklistConclude,
          result: checklistResult,
        },
      },
    });
    return result;
  }

  async listJobByDevice(params: ListJobByDeviceRequestDto, status?: number) {
    const { skip, take, serial, sort } = params;
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
    let condition: any = {};
    if (status !== null && status !== undefined) {
      condition = {
        status,
      };
    }
    const query = [
      {
        $match: condition,
      },
      {
        $lookup: {
          from: 'warnings',
          localField: 'jobTypeId',
          foreignField: '_id',
          as: 'warning',
          let: { type: '$type' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$$type', JOB_TYPE_ENUM.WARNING] },
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
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'maintainRequests',
          localField: 'jobTypeId',
          foreignField: '_id',
          as: 'maintainRequest',
          let: { type: '$type' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$$type', JOB_TYPE_ENUM.MAINTENANCE_REQUEST] },
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
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'warnings',
          localField: 'jobTypeId',
          foreignField: '_id',
          as: 'maintenancePeriodWarning',
          let: { type: '$type' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$$type', JOB_TYPE_ENUM.PERIOD_MAINTAIN] },
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
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'warnings',
          localField: 'jobTypeId',
          foreignField: '_id',
          as: 'checklistTemplate',
          let: { type: '$type' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$$type', JOB_TYPE_ENUM.PERIOD_CHECKLIST] },
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
        },
      },
      {
        $facet: {
          paginatedResults: [
            { $sort: isEmpty(sort) ? { createdAt: -1 } : sortObject },
            {
              $match: { 'deviceAssignment.serial': serial },
            },
            { $skip: skip },
            { $limit: take },
          ],
          totalCount: [
            {
              $match: { 'deviceAssignment.serial': serial },
            },
          ],
        },
      },
    ];
    const result = await this.jobModel.aggregate(query);
    return {
      skip,
      take,
      total: result[0].totalCount.length || 0,
      data: result[0].paginatedResults || [],
    };
  }

  async dashboardSummary() {
    const [
      totalAllItem,
      totalFinishItem,
      totalSemiFinishItem,
      totalOutOfDateItem,
    ] = await Promise.all([
      this.model.count(),
      this.model.count({ status: JOB_STATUS_ENUM.COMPLETED }),
      this.model.count({ status: JOB_STATUS_ENUM.IN_PROGRESS }),
      this.model.count({ status: JOB_STATUS_ENUM.OUT_OF_DATE }),
    ]);

    const data = {
      totalAllItem: totalAllItem,
      totalFinishItem: totalFinishItem,
      totalSemiFinishItem: totalSemiFinishItem,
      totalOutOfDateItem: totalOutOfDateItem,
    };
    return data;
  }

  async updateJobApprove(data: ApproveJobRequestDto): Promise<any> {
    const { id, history } = data;
    const result = await this.model.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        status: JOB_STATUS_ENUM.TO_DO,
        $push: { histories: history },
      },
    );
    return result;
  }

  async updateJobRedo(
    data: RedoJobRequestDto,
    isLateInProgress = false,
  ): Promise<any> {
    const { id, history } = data;
    const status = isLateInProgress
      ? JOB_STATUS_ENUM.LATE
      : JOB_STATUS_ENUM.IN_PROGRESS;
    const result = await this.model.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        status,
        $push: { histories: { ...history, status } },
      },
    );
    return result;
  }

  async updateJobInprogress(data: any): Promise<any> {
    const { id, history, executionDateFrom, isLateInProgress } = data;
    const status = isLateInProgress
      ? JOB_STATUS_ENUM.LATE
      : JOB_STATUS_ENUM.IN_PROGRESS;
    const result = await this.model.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        executionDateFrom,
        status: status,
        $push: { histories: { ...history, status } },
      },
    );
    return result;
  }

  async getJobByMaintainRequest(maintainRequestId: string): Promise<any> {
    const result = await this.jobModel.aggregate([
      {
        $match: {
          jobTypeId: new mongoose.Types.ObjectId(maintainRequestId),
          type: JOB_TYPE_ENUM.MAINTENANCE_REQUEST,
        },
      },
    ]);
    return result[0];
  }

  reportTotalJob(): Promise<any> {
    const condition: any = {
      planTo: {
        $lte: moment().endOf('day').toDate(),
      },
    };

    return this.jobModel
      .aggregate([
        {
          $match: condition,
        },
        {
          $group: {
            _id: {
              status: '$status',
              id: '$_id',
            },
            date: {
              $first: '$planTo',
            },
            count: { $count: {} },
          },
        },
      ])
      .exec();
  }

  reportNotCompleteJob(): Promise<any> {
    return this.jobModel
      .aggregate([
        {
          $match: {
            planFrom: {
              $lte: moment().endOf('day').toDate(),
            },
            planTo: {
              $gte: moment().startOf('day').toDate(),
            },
          },
        },
        {
          $group: {
            _id: {
              status: '$status',
              id: '$_id',
            },
            date: {
              $first: '$planTo',
            },
            count: { $count: {} },
          },
        },
      ])
      .exec();
  }

  reportCompleteJob(): Promise<any> {
    return this.jobModel
      .aggregate([
        {
          $match: {
            histories: {
              $elemMatch: {
                createdAt: {
                  $gte: moment().startOf('day').toDate(),
                  $lte: moment().endOf('day').toDate(),
                },
                status: JOB_STATUS_ENUM.RESOLVED,
              },
            },
          },
        },
        {
          $group: {
            _id: {
              status: '$status',
              id: '$_id',
            },
            date: {
              $first: '$planTo',
            },
            count: { $count: {} },
          },
        },
      ])
      .exec();
  }

  reportProgressJob(startDate: Date, endDate: Date): Promise<any> {
    return this.jobModel
      .find({
        'histories.createdAt': {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .exec();
  }

  getJobWithMttIndex(
    startDate: Date,
    endDate: Date,
    userIds: string[],
    maintainTeam: string,
    factory: number,
  ): Promise<any> {
    let filterObj: any = {};

    if (userIds.length) {
      filterObj = {
        $or: [
          {
            'assign.assignId': {
              $in: userIds,
            },
          },
          { 'assign.assignId': maintainTeam },
        ],
      };
    }

    let filterFactory: any = {};
    if (factory) {
      filterFactory = {
        factoryId: factory,
      };
    }

    return this.jobModel
      .find({
        'histories.createdAt': {
          $gte: startDate,
          $lte: moment(endDate).add(1, 'day').toDate(),
        },
        'histories.status': JOB_STATUS_ENUM.COMPLETED,
        type: {
          $in: [JOB_TYPE_ENUM.WARNING, JOB_TYPE_ENUM.MAINTENANCE_REQUEST],
        },
      })
      .find(filterObj)
      .populate({
        path: 'deviceAssignmentId',
        match: filterFactory,
      })
      .exec();
  }

  async getListJobProgress(request: ListJobProgressRequestDto): Promise<any> {
    const { keyword, sort, filter } = request;

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
          case 'serial':
            filterObj = {
              ...filterObj,
              'deviceAssignment.serial': {
                $regex: '.*' + value + '.*',
                $options: 'i',
              },
            };
            break;
          case 'code':
            filterObj = {
              ...filterObj,
              code: {
                $regex: '.*' + value + '.*',
                $options: 'i',
              },
            };
            break;
          case 'deviceName':
            filterObj = {
              ...filterObj,
              'deviceAssignment.device.name': {
                $regex: '.*' + value + '.*',
                $options: 'i',
              },
            };
            break;
          case 'type':
            filterObj = {
              ...filterObj,
              type: parseInt(item.text),
            };
            break;
          case 'status':
            filterObj = {
              ...filterObj,
              status: parseInt(item.text),
            };
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

    if (!isEmpty(sort)) {
      sort.forEach((item) => {
        const order = item.order?.toSortOrder();
        switch (item.column) {
          case 'serial':
            sortObj = {
              'deviceAssignment.serial': convertOrderMongo(order),
            };
            break;
          case 'deviceName':
            sortObj = {
              'deviceAssignment.device.name': convertOrderMongo(order),
            };
            break;
          case 'type':
            sortObj = {
              type: convertOrderMongo(order),
            };
            break;
          case 'status':
            sortObj = {
              status: convertOrderMongo(order),
            };
            break;
          case 'planFrom':
            sortObj = {
              planFrom: convertOrderMongo(order),
            };
            break;
          case 'planTo':
            sortObj = {
              planTo: convertOrderMongo(order),
            };
            break;
          case 'executionDateFrom':
            sortObj = {
              executionDateFrom: convertOrderMongo(order),
            };
            break;
          case 'executionDateTo':
            sortObj = {
              executionDateTo: convertOrderMongo(order),
            };
            break;
          default:
            break;
        }
      });
    } else {
      sortObj = { createdAt: -1 };
    }

    const data = await this.jobModel
      .aggregate([
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
            from: 'plans',
            localField: 'planId',
            foreignField: '_id',
            as: 'plan',
          },
        },
        {
          $match: {
            ...filterObj,
            $or: [
              {
                'plan.status': PLAN_STATUS_ENUM.CONFIRMED,
              },
              { planId: null },
            ],
          },
        },
        {
          $sort: sortObj,
        },
        {
          $facet: {
            data: [
              { $skip: (request.page - 1) * request.take },
              { $limit: request.take },
            ],
            count: [
              {
                $count: 'count',
              },
            ],
          },
        },
      ])
      .exec();

    return {
      data: data[0]?.data || [],
      count: data[0]?.count[0]?.count || 0,
    };
  }

  async findByIdsAndDelete(ids: Types.ObjectId[]): Promise<void> {
    const query = this.model.deleteMany({
      _id: {
        $in: ids,
      },
    });

    await query.exec();
  }

  async updateMultipleWithValues(bulkUpdate: any): Promise<any> {
    const rs = await this.jobModel.bulkWrite(bulkUpdate);
    return rs;
  }

  async findAndPopulate(condition: any, populate: any) {
    return await this.jobModel.find(condition).populate(populate).exec();
  }

  reportJob(request: ReportJobRequest, assignIds: string[]): Promise<any[]> {
    let filterObj = {};

    if (!isEmpty(request.filter))
      request.filter.forEach((item) => {
        switch (item.column) {
          case 'date':
            filterObj = {
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

    return this.jobModel
      .aggregate([
        {
          $match: filterObj,
        },
        {
          $project: {
            'assign.assignId': 1,
            planFrom: 1,
            planTo: 1,
            status: 1,
            type: 1,
            completedQuantity: {
              $cond: [{ $eq: ['$status', JOB_STATUS_ENUM.COMPLETED] }, 1, 0],
            },
            totalQuantity: {
              $cond: [{ $ne: ['$status', JOB_STATUS_ENUM.REJECTED] }, 1, 0],
            },
            inProgressQuantity: {
              $cond: [{ $eq: ['$status', JOB_STATUS_ENUM.IN_PROGRESS] }, 1, 0],
            },
            lateQuantity: {
              $cond: [{ $eq: ['$status', JOB_STATUS_ENUM.LATE] }, 1, 0],
            },
            waitQuantity: {
              $cond: [
                { $eq: ['$status', JOB_STATUS_ENUM.WAITING_TO_CONFIRMED] },
                1,
                0,
              ],
            },
            planQuantity: {
              $cond: [
                {
                  $in: [
                    '$type',
                    [
                      JOB_TYPE_ENUM.PERIOD_CHECKLIST,
                      JOB_TYPE_ENUM.PERIOD_MAINTAIN,
                    ],
                  ],
                },
                1,
                0,
              ],
            },
            incurredQuantity: {
              $cond: [
                {
                  $in: [
                    '$type',
                    [
                      JOB_TYPE_ENUM.INSTALLATION,
                      JOB_TYPE_ENUM.WARNING,
                      JOB_TYPE_ENUM.MAINTENANCE_REQUEST,
                    ],
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
        {
          $group: {
            _id: '$assign.assignId',
            completedQuantity: { $sum: '$completedQuantity' },
            inProgressQuantity: { $sum: '$inProgressQuantity' },
            lateQuantity: { $sum: '$lateQuantity' },
            waitQuantity: { $sum: '$waitQuantity' },
            planQuantity: { $sum: '$planQuantity' },
            incurredQuantity: { $sum: '$incurredQuantity' },
            totalQuantity: { $sum: '$totalQuantity' },
          },
        },
        {
          $match: {
            _id: { $ne: null, $in: assignIds },
          },
        },
      ])
      .exec();
  }

  reportJobDetail(assignIds: string[]): Promise<any[]> {
    return this.jobModel
      .aggregate([
        {
          $project: {
            'assign.assignId': 1,
            planFrom: 1,
            planTo: 1,
            status: 1,
            type: 1,
            completedQuantity: {
              $cond: [{ $eq: ['$status', JOB_STATUS_ENUM.RESOLVED] }, 1, 0],
            },
            totalQuantity: {
              $cond: [{ $ne: ['$status', JOB_STATUS_ENUM.REJECTED] }, 1, 0],
            },
            inProgressQuantity: {
              $cond: [{ $eq: ['$status', JOB_STATUS_ENUM.IN_PROGRESS] }, 1, 0],
            },
            lateQuantity: {
              $cond: [{ $eq: ['$status', JOB_STATUS_ENUM.LATE] }, 1, 0],
            },
            waitQuantity: {
              $cond: [
                { $eq: ['$status', JOB_STATUS_ENUM.WAITING_TO_CONFIRMED] },
                1,
                0,
              ],
            },
            planQuantity: {
              $cond: [
                {
                  $in: [
                    '$type',
                    [
                      JOB_TYPE_ENUM.PERIOD_CHECKLIST,
                      JOB_TYPE_ENUM.PERIOD_MAINTAIN,
                    ],
                  ],
                },
                1,
                0,
              ],
            },
            incurredQuantity: {
              $cond: [
                {
                  $in: [
                    '$type',
                    [
                      JOB_TYPE_ENUM.INSTALLATION,
                      JOB_TYPE_ENUM.WARNING,
                      JOB_TYPE_ENUM.MAINTENANCE_REQUEST,
                    ],
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
        {
          $group: {
            _id: '$assign.assignId',
            completedQuantity: { $sum: '$completedQuantity' },
            inProgressQuantity: { $sum: '$inProgressQuantity' },
            lateQuantity: { $sum: '$lateQuantity' },
            waitQuantity: { $sum: '$waitQuantity' },
            planQuantity: { $sum: '$planQuantity' },
            incurredQuantity: { $sum: '$incurredQuantity' },
            totalQuantity: { $sum: '$totalQuantity' },
          },
        },
        {
          $match: {
            _id: { $in: assignIds },
          },
        },
      ])
      .exec();
  }

  async listByPlanId(request: GetListJobByPlanIdRequestDto): Promise<any> {
    let condition: any = {};
    let checkMongoId = true;
    if (!isEmpty(request.filter)) {
      request.filter.forEach((filter) => {
        switch (filter.column) {
          case 'planId':
            checkMongoId = ObjectID.isValid(filter.text);

            if (checkMongoId)
              condition = {
                ...condition,
                planId: filter.text,
              };
            break;
          case 'type':
            condition = {
              ...condition,
              type: +filter.text,
            };
            break;
          default:
            break;
        }
      });
    }

    if (!checkMongoId) {
      return { data: [], count: 0 };
    }

    const data = await this.jobModel
      .find(condition)
      .populate({
        path: 'deviceAssignmentId',
        select:
          '_id deviceId serial factoryId workCenterId location workTimeDataSource productivityTarget',
        populate: {
          path: 'deviceId',
          model: 'Device',
          select: '_id code name status',
        },
      })
      .skip(request.skip)
      .limit(request.take)
      .exec();

    const count = await this.jobModel.find(condition).countDocuments().exec();

    return { count, data };
  }
}
