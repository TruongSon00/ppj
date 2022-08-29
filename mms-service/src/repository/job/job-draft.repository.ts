import { GetListJobByPlanIdRequestDto } from '@components/job/dto/request/get-list-job-in-plan.request';
import { JobDraftRepositoryInterface } from '@components/job/interface/job-draft.repository.interface';
import { ASSIGN_TYPE } from '@components/job/job.constant';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'lodash';
import { ObjectID } from 'mongodb';
import { Model } from 'mongoose';
import { JobDraft } from 'src/models/job/job-draft.model';

@Injectable()
export class JobDraftRepository
  extends BaseAbstractRepository<JobDraft>
  implements JobDraftRepositoryInterface
{
  constructor(
    @InjectModel('JobDraft')
    private readonly jobDraftModel: Model<JobDraft>,
  ) {
    super(jobDraftModel);
  }

  createDocument(
    deviceAssignmentId: string,
    uuid: string,
    assignId: string,
    assignType: ASSIGN_TYPE,
    planFrom: Date,
    planTo: Date,
    type: number,
    planId: string,
  ): JobDraft {
    const newDocument = new this.jobDraftModel();
    newDocument.deviceAssignmentId = deviceAssignmentId;
    newDocument.uuid = uuid;
    newDocument.planId = planId;
    newDocument.assignId = assignId;
    newDocument.assignType = assignType;
    newDocument.planFrom = planFrom;
    newDocument.planTo = planTo;
    newDocument.type = type;
    return newDocument;
  }

  deleteManyByCondition(condition: any): Promise<any> {
    return this.jobDraftModel.deleteMany(condition).exec();
  }

  detail(id: string): Promise<any> {
    return this.jobDraftModel
      .findOne({
        _id: id,
      })
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
      .exec();
  }

  async list(request: GetListJobByPlanIdRequestDto): Promise<any> {
    let condition: any = {};
    let checkMongoId = true;
    if (!isEmpty(request.filter)) {
      request.filter.forEach((filter) => {
        switch (filter.column) {
          case 'uuid':
            condition = {
              ...condition,
              uuid: filter.text,
            };
            break;
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

    const data = await this.jobDraftModel
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

    const count = await this.jobDraftModel
      .find(condition)
      .countDocuments()
      .exec();

    return { count, data };
  }

  findAllWithPopulate(condition: any, populate: any): Promise<any[]> {
    return this.jobDraftModel.find(condition).populate(populate).exec();
  }
}
