import { BaseInterfaceRepository } from '@core/repository/base.interface.repository';
import { JobDraft } from 'src/models/job/job-draft.model';
import { GetListJobByPlanIdRequestDto } from '../dto/request/get-list-job-in-plan.request';
import { ASSIGN_TYPE } from '../job.constant';

export interface JobDraftRepositoryInterface
  extends BaseInterfaceRepository<JobDraft> {
  createDocument(
    deviceAssignmentId: string,
    uuid: string,
    assignId: string,
    assignType: ASSIGN_TYPE,
    planFrom: Date,
    planTo: Date,
    type: number,
    planId: string,
  ): JobDraft;

  deleteManyByCondition(condition: any): Promise<any>;

  detail(id: string): Promise<any>;

  findAllWithPopulate(condition: any, populate: any): Promise<any[]>;

  list(request: GetListJobByPlanIdRequestDto): Promise<any>;
}
