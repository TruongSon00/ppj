import { HistoryActionEnum } from '@components/history/history.constant';
import { JobRepositoryInterface } from '@components/job/interface/job.repository.interface';
import {
  ASSIGN_TYPE,
  JOB_STATUS_ENUM,
  JOB_TYPE_ENUM,
} from '@components/job/job.constant';
import { MaintenanceTeamRepositoryInterface } from '@components/maintenance-team/interface/maintenance-team.repository.interface';
import { UserService } from '@components/user/user.service';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiError } from '@utils/api.error';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { first, has, isEmpty, keyBy, uniq } from 'lodash';
import { Connection } from 'mongoose';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { DetailPlanRequestDto } from './dto/request/get-plan-detail.request.dto';
import { UpdatePlanStatusRequestDto } from './dto/request/update-plan-status.request.dto';
import { PlanRepositoryInterface } from './interface/plan.repository.interface';
import { PlanServiceInterface } from './interface/plan.service.interface';
import { PLAN_MODE, PLAN_STATUS_ENUM } from './plan.constant';
import { CreatePlanRequestDto } from './dto/request/create-plan.request.dto';
import * as moment from 'moment';
import * as mongoose from 'mongoose';
import { DeviceAssignmentRepositoryInterface } from '@components/device-assignment/interface/device-assignment.repository.interface';
import { plainToInstance } from 'class-transformer';
import { checkIsSqlId } from '@utils/helper';
import { PlanDetailResponseDto } from './dto/response/plan-detail.response.dto';
import { UpdatePlanRequestDto } from './dto/request/update-plan.request.dto';
import { checkRuleItOrAdmin, mul, plus } from '@utils/common';
import { DeletePlanRequestDto } from './dto/request/delete-plan.request';
import { GanttChartPlanQuery } from './dto/query/gantt-chart-plan.query';
import { GanttChartResponse } from './dto/response/gantt-chart.response';
import { ProduceService } from '@components/produce/produce.service';
import { GenerateJobForPlanRequest } from './dto/request/generate-job-for-plan.request';
import { WarningRepositoryInterface } from '@components/warning/interface/warning.repository.interface';
import { GeneralMaintenanceParameterRepositoryInterface } from '@components/general-maintenance-parameter/interface/general-maintenance-parameter.repository.interface';
import { DEFAULT_WARNING_SAFE_TIME, HISTORY_ACTION } from '@constant/common';
import { JobDraftRepositoryInterface } from '@components/job/interface/job-draft.repository.interface';
import {
  WARNING_STATUS_ENUM,
  WARNING_TYPE_ENUM,
} from '@components/warning/warning.constant';
import {
  PERIOD_WARNING_PRIORITY_ENUM,
  PERIOD_WARNING_TYPE_ENUM,
} from '@components/maintenance-period-warning/maintenance-period-warning.constant';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { JobDraftResponse } from './dto/response/job-draft.response';
import { v4 as uuidv4 } from 'uuid';

const NUMBER_RECORD = 100;

@Injectable()
export class PlanService implements PlanServiceInterface {
  constructor(
    @Inject('PlanRepositoryInterface')
    private readonly planRepository: PlanRepositoryInterface,

    @Inject('JobRepositoryInterface')
    private readonly jobRepository: JobRepositoryInterface,

    @Inject('MaintenanceTeamRepositoryInterface')
    private readonly maintenanceTeamRepository: MaintenanceTeamRepositoryInterface,

    @Inject('DeviceAssignmentRepositoryInterface')
    private readonly deviceAssignmentRepository: DeviceAssignmentRepositoryInterface,

    @Inject('WarningRepositoryInterface')
    private readonly warningRepository: WarningRepositoryInterface,

    @Inject('GeneralMaintenanceParameterRepositoryInterface')
    private generalMaintenanceParameterRepository: GeneralMaintenanceParameterRepositoryInterface,

    @Inject('JobDraftRepositoryInterface')
    private jobDraftRepository: JobDraftRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,

    @Inject('UserServiceInterface')
    private readonly userService: UserService,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceService,

    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async listPlan(request: any): Promise<ResponsePayload<any>> {
    try {
      const { result, count, pageIndex, pageSize } =
        await this.planRepository.getList(request);
      const finalRes = (result || []).map((item) => ({
        ...item,
        jobExecutionTotal: item.jobExecutionTotal || 0,
      }));
      return new ResponseBuilder({
        items: finalRes,
        meta: { total: count, page: pageIndex, size: pageSize },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  async reject(
    request: UpdatePlanStatusRequestDto,
  ): Promise<ResponsePayload<any>> {
    try {
      const { status } = checkRuleItOrAdmin(request.user, PLAN_MODE.REJECT);
      if (!status) {
        return new ApiError(
          ResponseCodeEnum.FORBIDDEN,
          await this.i18n.translate('error.FORBIDDEN'),
        ).toResponse();
      }
      const plan = await this.planRepository.findOneById(request.id);
      if (!plan) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.PLAN_NOT_FOUND'),
        ).toResponse();
      }

      if (plan.status !== PLAN_STATUS_ENUM.WAITING_TO_CONFIRMED) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.STATUS_PLAN_INVALID'),
        ).toResponse();
      }
      this.planRepository.findByIdAndUpdate(plan._id.toString(), {
        status: PLAN_STATUS_ENUM.REJECTED,
        $push: {
          histories: {
            userId: request.user.id,
            userName: request.user.username,
            action: HistoryActionEnum.UPDATE,
            createdAt: new Date(),
            status: PLAN_STATUS_ENUM.REJECTED,
          },
          reason: request.reason,
        },
      });

      const jobs = await this.jobRepository.findAllByCondition({
        planId: plan._id,
      });
      const jobIds = jobs.map((item) => item._id);
      this.jobRepository.findByIdsAndDelete(jobIds);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder(error)
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  async approve(
    request: UpdatePlanStatusRequestDto,
  ): Promise<ResponsePayload<any>> {
    try {
      const { status } = checkRuleItOrAdmin(request.user, PLAN_MODE.APPROVE);
      if (!status) {
        return new ApiError(
          ResponseCodeEnum.FORBIDDEN,
          await this.i18n.translate('error.FORBIDDEN'),
        ).toResponse();
      }

      const plan = await this.planRepository.findOneByCondition({
        _id: request.id,
        deletedAt: null,
      });

      if (!plan) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.PLAN_NOT_FOUND'),
        ).toResponse();
      }
      if (plan.status !== PLAN_STATUS_ENUM.WAITING_TO_CONFIRMED) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate(
            plan.status === PLAN_STATUS_ENUM.CONFIRMED
              ? 'error.PLAN_STATUS_APPROVE_INVALID'
              : 'error.PLAN_STATUS_REJECT_INVALID',
          ),
        ).toResponse();
      }

      const existedPlans = await this.planRepository.checkPlanDate(
        plan.planFrom,
        plan.planTo,
        null,
        plan.factoryId,
        plan.workCenterId,
      );
      if (!isEmpty(existedPlans)) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.INVALID_PLAN_DATE_RANGE'),
        ).toResponse();
      }

      await this.planRepository.findByIdAndUpdate(plan._id.toString(), {
        status: PLAN_STATUS_ENUM.CONFIRMED,
        $push: {
          histories: {
            userId: request.user.id,
            userName: request.user.username,
            action: HistoryActionEnum.UPDATE,
            createdAt: new Date(),
            status: PLAN_STATUS_ENUM.CONFIRMED,
          },
          reason: request.reason,
        },
      });

      const jobDraftExists = await this.jobDraftRepository.findAllByCondition({
        planId: request.id,
      });

      const jobReal = jobDraftExists.map((job) =>
        this.jobRepository.createJobEntity({
          status: job.status,
          deviceAssignmentId: job.deviceAssignmentId,
          planFrom: job.planFrom,
          planTo: job.planTo,
          type: job.type,
          planId: plan._id,
          histories: [
            {
              userId: request.userId,
              content: `${request.user.username} đã tạo công việc`,
              createdAt: new Date(),
              action: HISTORY_ACTION.CREATED,
            },
          ],
        }),
      );

      await this.jobRepository.createJobEntity(jobReal);

      await this.jobDraftRepository.deleteManyByCondition({
        planId: request.id,
      });

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder(error)
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  async planDetail(
    request: DetailPlanRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { id } = checkRuleItOrAdmin(request.user, PLAN_MODE.DETAIL);
    const { planDetail, pageIndex, pageSize } =
      await this.planRepository.getDetail(request, id);
    const total = planDetail[0]?.jobs[0]?.totalCount[0]?.count || 0;

    if (!planDetail[0])
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.PLAN_NOT_FOUND'),
      ).toResponse();
    const plan = planDetail[0];
    const jobs = plan?.jobs[0]?.paginatedResults;

    if (plan?.factoryId) {
      const factory = await this.userService.detailFactory(
        planDetail[0]?.factoryId,
      );
      planDetail[0].factoryName = factory?.data?.name || null;
    }

    if (plan.workCenterId) {
      const workCenter = await this.produceService.getDetailWorkCenter(
        planDetail[0].workCenterId,
      );
      planDetail[0].workCenterName = workCenter?.name || null;
    }

    const jobDraftsReturn = await this.jobDraftRepository.findAllWithPopulate(
      {
        planId: request.id,
      },
      {
        path: 'deviceAssignmentId',
        select: '_id deviceId serial',
        populate: {
          path: 'deviceId',
          model: 'Device',
          select: '_id code name',
        },
      },
    );

    const dataReturn = plainToInstance(JobDraftResponse, jobDraftsReturn, {
      excludeExtraneousValues: true,
    });

    const result = plainToInstance(
      PlanDetailResponseDto,
      {
        ...plan,
        jobs,
      },
      {
        excludeExtraneousValues: true,
      },
    );

    result.jobDrafts = dataReturn;

    return new ResponseBuilder({
      result,
      meta: { total, page: pageIndex, size: pageSize },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async create(request: CreatePlanRequestDto): Promise<ResponsePayload<any>> {
    const user = await this.userService.detailUser(request.user.id);
    request.user = user.data;
    const { status } = checkRuleItOrAdmin(request.user, PLAN_MODE.CREATE);

    if (!status) {
      return new ApiError(
        ResponseCodeEnum.FORBIDDEN,
        await this.i18n.translate('error.FORBIDDEN'),
      ).toResponse();
    }

    const { code } = request;
    const planCode = await this.planRepository.findAllByCondition({
      code,
      deletedAt: null,
    });
    if (!isEmpty(planCode)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.PLAN_CODE_EXISTED'),
      ).toResponse();
    }

    const existedPlans = await this.planRepository.checkPlanDate(
      request.planFrom,
      request.planTo,
      null,
      request.factoryId,
      request.workCenterId,
    );
    if (!isEmpty(existedPlans)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.INVALID_PLAN_DATE_RANGE'),
      ).toResponse();
    }

    if (request.factoryId) {
      const factory = await this.userService.detailFactory(request.factoryId);

      if (factory.statusCode !== ResponseCodeEnum.SUCCESS) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.FACTORY_NOT_FOUND'),
        ).toResponse();
      }

      if (request.workCenterId) {
        const workCenter = await this.produceService.getDetailWorkCenter(
          request.workCenterId,
        );

        if (isEmpty(workCenter)) {
          return new ApiError(
            ResponseCodeEnum.NOT_FOUND,
            await this.i18n.translate('error.WORK_CENTER_NOT_FOUND'),
          ).toResponse();
        }

        if (workCenter.factoryId !== factory.data.id) {
          return new ApiError(
            ResponseCodeEnum.BAD_REQUEST,
            await this.i18n.translate('error.WORK_CENTER_NOT_IN_FACTORY'),
          ).toResponse();
        }
      }
    }

    const planDocument = this.planRepository.createDocument(request);
    planDocument.histories.push({
      userId: request.user.id,
      action: HistoryActionEnum.CREATE,
      createdAt: new Date(),
    });

    const plan = await planDocument.save();

    if (request.uuid)
      await this.jobDraftRepository.updateManyByCondition(
        { uuid: request.uuid },
        { planId: plan._id },
      );

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async update(request: UpdatePlanRequestDto): Promise<ResponsePayload<any>> {
    const { id, code, name, planFrom, planTo, user, jobTypeTotal } = request;
    const plan = await this.planRepository.findOneByCondition({
      _id: id,
      deletedAt: null,
    });

    if (!plan) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.PLAN_NOT_FOUND'),
      ).toResponse();
    }

    const { status } = checkRuleItOrAdmin(
      user,
      PLAN_MODE.UPDATE,
      plan.createdBy,
    );
    if (!status) {
      return new ApiError(
        ResponseCodeEnum.FORBIDDEN,
        await this.i18n.translate('error.FORBIDDEN'),
      ).toResponse();
    }

    if (plan.status !== PLAN_STATUS_ENUM.WAITING_TO_CONFIRMED) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.PLAN_NAME_AND_CODE_CANNOT_UPDATE'),
      ).toResponse();
    }

    const existedPlans = await this.planRepository.checkPlanDate(
      request.planFrom,
      request.planTo,
      null,
      request.factoryId,
      request.workCenterId,
    );
    if (!isEmpty(existedPlans)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.INVALID_PLAN_DATE_RANGE'),
      ).toResponse();
    }

    if (request.factoryId) {
      const factory = await this.userService.detailFactory(request.factoryId);

      if (factory.statusCode !== ResponseCodeEnum.SUCCESS) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.FACTORY_NOT_FOUND'),
        ).toResponse();
      }

      if (request.workCenterId) {
        const workCenter = await this.produceService.getDetailWorkCenter(
          request.workCenterId,
        );

        if (isEmpty(workCenter)) {
          return new ApiError(
            ResponseCodeEnum.NOT_FOUND,
            await this.i18n.translate('error.WORK_CENTER_NOT_FOUND'),
          ).toResponse();
        }

        if (workCenter.factoryId !== factory.data.id) {
          return new ApiError(
            ResponseCodeEnum.BAD_REQUEST,
            await this.i18n.translate('error.WORK_CENTER_NOT_IN_FACTORY'),
          ).toResponse();
        }
      }
    }

    await this.planRepository.findByIdAndUpdate(id, {
      name:
        plan.status === PLAN_STATUS_ENUM.WAITING_TO_CONFIRMED
          ? name
          : plan.name,
      code:
        plan.status === PLAN_STATUS_ENUM.WAITING_TO_CONFIRMED
          ? code
          : plan.code,
      planFrom,
      planTo,
      jobTypeTotal,
      histories: {
        userId: request.user.id,
        userName: request.user.username,
        action: HistoryActionEnum.UPDATE,
        createdAt: new Date(),
        status: plan.status,
      },
    });

    await this.jobDraftRepository.updateManyByCondition(
      { uuid: request.uuid, planId: null },
      { planId: id },
    );

    return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
  }

  async delete(request: DeletePlanRequestDto): Promise<ResponsePayload<any>> {
    const plan = await this.planRepository.findOneByCondition({
      _id: request.id,
      deletedAt: null,
    });

    if (!plan) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.PLAN_NOT_FOUND'),
      ).toResponse();
    }

    const { status } = checkRuleItOrAdmin(
      request.user,
      PLAN_MODE.UPDATE,
      plan.createdBy,
    );

    if (!status) {
      return new ApiError(
        ResponseCodeEnum.FORBIDDEN,
        await this.i18n.translate('error.FORBIDDEN'),
      ).toResponse();
    }

    plan.deletedAt = new Date();

    await plan.save();

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async ganttChart(
    request: GanttChartPlanQuery,
  ): Promise<ResponsePayload<any>> {
    const plans = await this.planRepository.ganttChart(request);
    const userIds = [];
    const teamIds = [];
    const userMap = new Map();
    plans.forEach((plan) => {
      if (!isEmpty(plan.jobs)) {
        plan.jobs.forEach((job) => {
          if (!isEmpty(job.assign) && job.assign.type === ASSIGN_TYPE.USER) {
            userIds.push(job.assign.assignId);
          }
          if (!isEmpty(job.assign) && job.assign.type === ASSIGN_TYPE.TEAM) {
            teamIds.push(job.assign.assignId);
          }
        });
      }
    });

    const teams = await this.maintenanceTeamRepository.findAllByCondition({
      _id: {
        $in: teamIds,
      },
    });

    const users = await this.userService.getListByIDs(
      uniq(userIds.filter((id) => id)),
    );
    teams.forEach((team) => {
      userMap.set(team._id.toString(), team.name);
    });
    users.forEach((user) => {
      userMap.set(user.id.toString(), user.fullName);
    });

    const dataReturn = plainToInstance(GanttChartResponse, <any[]>plans, {
      excludeExtraneousValues: true,
    });

    dataReturn.forEach((plan) => {
      const flagDate = plan.planTo;
      let endDate: Date = moment().toDate();

      plan.jobs.forEach((job) => {
        if (moment(job.executionDateTo).isAfter(flagDate, 'day')) {
          if (!job.executionDateTo) {
            job.endDate = moment().toDate();
          } else if (moment(job.executionDateTo).isAfter(endDate, 'day')) {
            endDate = job.executionDateTo;
          }
        }
        job.assign.name = userMap.get(job.assign.id);
      });

      plan.endDate = endDate;
    });

    return new ResponseBuilder({
      items: dataReturn,
      meta: { total: plans.length },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async getUserOrTeamsAssign(jobs, validNumberAssign = false) {
    const userAssignIds = [];
    const teamAssignIds = [];
    let userAssignList = [];
    let teamAssignList = [];
    jobs.forEach((job) => {
      if (
        has(job, 'assign') &&
        checkIsSqlId(job.assign) &&
        !userAssignIds.includes(job.assign)
      ) {
        userAssignIds.push(Number(job.assign));
      }
      if (
        has(job, 'assign') &&
        mongoose.isValidObjectId(job.assign) &&
        !teamAssignIds.includes(job.assign)
      ) {
        teamAssignIds.push(job.assign);
      }
    });
    if (!isEmpty(userAssignIds))
      userAssignList =
        (await this.userService.listUserByIds(userAssignIds))?.data ?? [];
    if (!isEmpty(teamAssignIds))
      teamAssignList = await this.maintenanceTeamRepository.findAllByCondition({
        _id: {
          $in: teamAssignIds,
        },
      });
    if (validNumberAssign) {
      return {
        userAssignList:
          userAssignList.length === userAssignIds.length
            ? userAssignList
            : null,
        teamAssignList:
          teamAssignList.length === teamAssignIds.length
            ? teamAssignList
            : null,
      };
    }
    return { userAssignList, teamAssignList };
  }

  async generateJobForPlan(
    request: GenerateJobForPlanRequest,
  ): Promise<ResponsePayload<any>> {
    let deviceAssignments = [];

    if (request.factoryId) {
      deviceAssignments =
        await this.deviceAssignmentRepository.findAllByCondition({
          factoryId: request.factoryId,
        });

      if (request.workCenterId) {
        deviceAssignments = deviceAssignments.filter(
          (deviceAssign) => deviceAssign.workCenterId === request.workCenterId,
        );
      }

      const deviceAssginmentIds = deviceAssignments.map((item) => item._id);

      deviceAssignments =
        await this.deviceAssignmentRepository.deviceAssignmentWithRelationByIds(
          deviceAssginmentIds,
        );

      if (isEmpty(deviceAssignments)) {
        return new ResponseBuilder([])
          .withCode(ResponseCodeEnum.SUCCESS)
          .withMessage(await this.i18n.translate('success.SUCCESS'))
          .build();
      }
    } else {
      const { count } =
        await this.deviceAssignmentRepository.deviceAssignmentWithRelation();
      let number = 1;
      if (count > NUMBER_RECORD) {
        number = !(count % NUMBER_RECORD)
          ? count / NUMBER_RECORD
          : Math.ceil(count / NUMBER_RECORD);
      }

      for (let i = 0; i < number; i++) {
        const { items = [] } =
          await this.deviceAssignmentRepository.deviceAssignmentWithRelation(
            NUMBER_RECORD,
            i + 1,
          );
        deviceAssignments.push(...items);
      }
    }

    let condition: any = {
      planFrom: {
        $gte: moment(request.planFrom).startOf('day').toDate(),
        $lte: moment(request.planTo).endOf('day').toDate(),
      },
      planTo: {
        $gte: moment(request.planFrom).startOf('day').toDate(),
        $lte: moment(request.planTo).endOf('day').toDate(),
      },
    };

    if (!isEmpty(request.planId) || !isEmpty(request.uuid)) {
      condition = {
        ...condition,
        $or: [{ planId: request.planId }, { uuid: request.uuid }],
      };
    }

    const jobDraftExists = await this.jobDraftRepository.findAllByCondition(
      condition,
    );

    const jobDraftExistMap = new Map();

    jobDraftExists.forEach((job) => {
      jobDraftExistMap.set(
        `uuid_${job.uuid}_${job.type}` ?? `planId_${job.planId}_${job.type}`,
        true,
      );
    });
    const [jobsChecklist, jobsMaintain] = await this.getJobSuggest(
      request.planFrom,
      request.planTo,
      deviceAssignments,
      request.uuid,
      request.planId,
    );

    const jobDraftDocuments = [];
    const uuid = uuidv4();
    [...jobsChecklist, ...jobsMaintain].map((job) => {
      if (
        !jobDraftExistMap.get(
          `${job.uuid}_${job.type}` ?? `${job.planId}_${job.type}`,
        ) &&
        moment(job.planTo)
          .endOf('day')
          .isSameOrBefore(moment(request.planTo).endOf('day'))
      ) {
        jobDraftDocuments.push(
          this.jobDraftRepository.createDocument(
            job.deviceAssignmentId,
            request.uuid ?? uuid,
            job?.assignId,
            job?.assignType,
            job?.planFrom,
            job?.planTo,
            job?.type,
            request.planId,
          ),
        );
      }
    });

    await this.jobDraftRepository.createMany(uniq(jobDraftDocuments));

    return new ResponseBuilder({ uuid: request.uuid ?? uuid })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  private async getJobSuggest(
    planFrom: Date,
    planTo: Date,
    deviceAssignments: any[],
    uuid: string,
    planId: string,
  ): Promise<any> {
    const jobsChecklist = await this.suggestJobChecklist(
      planFrom,
      planTo,
      deviceAssignments,
      uuid,
      planId,
    );

    const jobsMaintain = await this.suggestJobMaintain(
      planFrom,
      planTo,
      deviceAssignments,
      uuid,
      planId,
    );

    return [jobsChecklist, jobsMaintain];
  }

  private async suggestJobChecklist(
    planFrom: Date,
    planTo: Date,
    deviceAssignments: any[],
    uuid: string,
    planId: string,
  ): Promise<any[]> {
    const dataJobs = [];
    deviceAssignments?.forEach(async (deviceAssignment) => {
      const time = moment(planFrom);
      const lastDate = moment(planTo);
      const totalDay = lastDate.diff(time, 'days');

      const timeWarnings = [];
      if (totalDay > 0) {
        for (
          let i = 0;
          i <= totalDay;
          i += deviceAssignment.device[0].periodicInspectionTime
        ) {
          timeWarnings.push(moment(time).add(i, 'days'));
        }
      }
      if (!isEmpty(timeWarnings)) {
        timeWarnings?.forEach((timeWarning) => {
          dataJobs.push({
            deviceAssignmentId: deviceAssignment._id,
            id: null,
            code: null,
            deviceName: deviceAssignment.device[0]?.name,
            serial: deviceAssignment.serial,
            assignUser: null,
            status: null,
            planFrom: timeWarning,
            planTo: timeWarning,
            executionDateFrom: null,
            executionDateTo: null,
            type: JOB_TYPE_ENUM.PERIOD_CHECKLIST,
            uuid: `uuid_${uuid}`,
            planId: `planId_${planId}`,
          });
        });
      }
    });

    return dataJobs;
  }

  async suggestJobMaintain(
    planFrom: Date,
    planTo: Date,
    deviceAssignments: any[],
    uuid: string,
    planId: string,
  ): Promise<any[]> {
    const dataJobs = [];
    const maintenanceParams =
      await this.generalMaintenanceParameterRepository.findAll();
    const timeWarningSafe =
      first(maintenanceParams)?.time || DEFAULT_WARNING_SAFE_TIME; // Thời gian cảnh báo an toàn
    const totalActive = 500; // hoạt động thực tế cộng dồn
    const totalActiveLatest = 200; // hoạt động thực tế  gần nhất
    let countTimeWarningSafe = timeWarningSafe;
    for (
      let date = moment(planFrom);
      date.isSameOrBefore(moment(planTo));
      date.add(timeWarningSafe, 'day')
    ) {
      deviceAssignments = deviceAssignments.filter((deviceAssign) => {
        return (
          deviceAssign.device[0].information.maintenancePeriod &&
          +deviceAssign.device[0].information.maintenancePeriod - totalActive <
            countTimeWarningSafe * totalActiveLatest
        );
      });
      countTimeWarningSafe = plus(countTimeWarningSafe, timeWarningSafe);
      deviceAssignments?.forEach((deviceAssign) => {
        dataJobs.push({
          deviceAssignmentId: deviceAssign._id,
          id: null,
          code: null,
          deviceName: deviceAssign.device[0]?.name,
          serial: deviceAssign.serial,
          assignUser: null,
          status: null,
          planFrom: moment(date).add(timeWarningSafe, 'days'),
          planTo: moment(date).add(timeWarningSafe, 'days'),
          executionDateFrom: null,
          executionDateTo: null,
          type: JOB_TYPE_ENUM.PERIOD_MAINTAIN,
          uuid: `uuid_${uuid}`,
          planId: `planId_${planId}`,
        });
      });
    }

    return dataJobs;
  }

  async createWarningChecklist(
    deviceAssginmentIds: string[],
    planFrom: Date,
    planTo: Date,
    user: UserInforRequestDto,
  ) {
    const warnings = await this.warningRepository.findAllByCondition({
      type: WARNING_TYPE_ENUM.CHECKLIST_TEMPLATE,
    });
    const warningList = keyBy(
      warnings,
      (warning) =>
        `${warning.deviceAssignmentId.toString()}-${moment(warning.scheduleDate)
          .format('DD-MM-YYYY')
          .toString()}`,
    );

    const userName = await this.i18n.translate('text.SYSTEM');
    const content = await this.i18n.translate(
      'text.SYSTEM_CREATE_WARNING_CHECKLIST_TEMPLATE',
    );
    const dataInsert = [];
    const items =
      await this.deviceAssignmentRepository.deviceAssignmentWithRelationByIds(
        deviceAssginmentIds,
      );
    items?.forEach(async (deviceAssignment) => {
      let time = moment(planFrom);
      if (deviceAssignment.warning.length) {
        const warning = deviceAssignment.warning.find(
          (i) =>
            i.status === WARNING_STATUS_ENUM.COMPLETED &&
            i.type === WARNING_TYPE_ENUM.CHECKLIST_TEMPLATE,
        );
        if (warning) time = moment(warning.updatedAt);
      }
      const lastDateOfCurrentMonth = moment(planTo);
      const totalDay = lastDateOfCurrentMonth.diff(time, 'days');
      // totalDay > 0, time in current month
      const timeWarnings = [];
      if (totalDay > 0) {
        for (
          let i = 0;
          i <= totalDay;
          i += deviceAssignment.device[0].periodicInspectionTime
        ) {
          timeWarnings.push(moment(planFrom).add(i, 'days'));
        }
      }

      if (
        !isEmpty(timeWarnings) &&
        !isEmpty(deviceAssignment.checkListTemplate)
      ) {
        timeWarnings?.forEach((timeWarning) => {
          if (
            !warningList[
              `${deviceAssignment._id.toString()}-${moment(timeWarning)
                .format('DD-MM-YYYY')
                .toString()}`
            ]
          ) {
            dataInsert.push({
              name: deviceAssignment.checkListTemplate[0]?.name,
              deviceAssignmentId: deviceAssignment._id,
              status: WARNING_STATUS_ENUM.CREATED,
              details: deviceAssignment.checkListTemplate[0]?.details.map(
                (detail) => ({
                  ...detail,
                  subtitle: detail.description,
                  description: null,
                  obligatory: detail?.obligatory ?? 0,
                }),
              ),
              description: deviceAssignment.checkListTemplate[0]?.description,
              type: WARNING_TYPE_ENUM.CHECKLIST_TEMPLATE,
              scheduleDate: timeWarning,
              histories: [
                {
                  content: content,
                  userName: userName,
                  createdAt: new Date(),
                  action: HISTORY_ACTION.CREATED,
                },
              ],
            });
          }
        });
      }
    });

    const newWarnings = await this.warningRepository.createManyWarning(
      dataInsert,
    );

    const dataJobs = [];
    newWarnings.forEach((warning) => {
      dataJobs.push({
        priority: warning.priority,
        deviceAssignmentId: warning.deviceAssignmentId,
        histories: [
          {
            userId: user.id,
            content: `${user.username} đã tạo công việc`,
            createdAt: new Date(),
            action: HISTORY_ACTION.CREATED,
          },
        ],
        jobTypeId: warning.id,
        type: JOB_TYPE_ENUM.PERIOD_CHECKLIST,
        status: JOB_STATUS_ENUM.PLANNING,
      });
    });

    await this.jobRepository.createManyJobEntity(dataJobs);
  }

  async warningMaintancePeriodDevice(
    deviceAssginmentIds: string[],
    planFrom: Date,
    planTo: Date,
    user: UserInforRequestDto,
  ) {
    const countDay = moment(planTo).diff(moment(planFrom), 'day');
    const warnings = await this.warningRepository.findAllByCondition({
      type: WARNING_TYPE_ENUM.PERIOD_MANTANCE,
      maintanceType: PERIOD_WARNING_TYPE_ENUM.PERIOD_WARNING_DEVICE,
      deviceAssignmentId: {
        $in: deviceAssginmentIds,
      },
    });
    const warningList = keyBy(
      warnings,
      (warning) =>
        `${warning.deviceAssignmentId.toString()}-${moment(warning.scheduleDate)
          .format('DD-MM-YYYY')
          .toString()}`,
    );

    const deviceAssignments =
      await this.deviceAssignmentRepository.getDeviceAssignmentByIds(
        deviceAssginmentIds,
      );
    const maintenanceParams =
      await this.generalMaintenanceParameterRepository.findAll();
    const totalActive = 500; // hoạt động thực tế cộng dồn
    const totalActiveLatest = 200; // hoạt động thực tế  gần nhất
    const items = [];
    for (let i = 0; i < countDay; i++) {
      const timeWarningSafe = plus(
        first(maintenanceParams)?.time || DEFAULT_WARNING_SAFE_TIME,
        mul(i, first(maintenanceParams)?.time || DEFAULT_WARNING_SAFE_TIME),
      ); // Thời gian cảnh báo an toàn

      const listDeviceAssignments = deviceAssignments.filter((deviceAssign) => {
        return (
          deviceAssign.device[0].information.maintenancePeriod &&
          +deviceAssign.device[0].information.maintenancePeriod - totalActive <
            timeWarningSafe * totalActiveLatest &&
          !warningList[
            `${deviceAssign._id.toString()}-${moment()
              .add(timeWarningSafe, 'days')
              .format('DD-MM-YYYY')
              .toString()}`
          ]
        );
      });

      const name = await this.i18n.translate(
        'text.NAME_MAINTENANCE_DEVICE_WARNING',
      );
      const description = await this.i18n.translate(
        'text.DESCRIPTION_MAINTENANCE_DEVICE_WARNING',
      );
      const userName = await this.i18n.translate('text.SYSTEM');
      const content = await this.i18n.translate(
        'text.SYSTEM_CREATE_WARNING_MAINTANCE_PEROID',
      );
      items.push(
        ...listDeviceAssignments?.map((deviceAssign) => {
          const deviceName = deviceAssign.device[0].name;
          return {
            deviceAssignmentId: deviceAssign._id,
            priority: PERIOD_WARNING_PRIORITY_ENUM.MAJOR,
            maintanceType: PERIOD_WARNING_TYPE_ENUM.PERIOD_WARNING_DEVICE,
            status: WARNING_STATUS_ENUM.CREATED,
            name: name.replace(':deviceName', deviceName),
            description: description.replace(':deviceName', deviceName),
            completeExpectedDate: moment()
              .add(timeWarningSafe, 'days')
              .add(+deviceAssign.mttrIndex, 'minutes')
              .add(+deviceAssign.mttaIndex, 'minutes'),
            type: WARNING_TYPE_ENUM.PERIOD_MANTANCE,
            scheduleDate: moment().add(timeWarningSafe, 'days'),
            histories: [
              {
                content: content,
                userName: userName,
                createdAt: new Date(),
                action: HISTORY_ACTION.CREATED,
              },
            ],
          };
        }),
      );
    }

    const newWarnings = await this.warningRepository.createManyWarning(items);

    const dataJobs = [];
    newWarnings.forEach((warning) => {
      dataJobs.push({
        priority: warning.priority,
        deviceAssignmentId: warning.deviceAssignmentId,
        histories: [
          {
            userId: user.id,
            content: `${user.username} đã tạo công việc`,
            createdAt: new Date(),
            action: HISTORY_ACTION.CREATED,
          },
        ],
        jobTypeId: warning.id,
        type: JOB_TYPE_ENUM.PERIOD_MAINTAIN,
        status: JOB_STATUS_ENUM.PLANNING,
      });
    });

    await this.jobRepository.createManyJobEntity(dataJobs);
  }
}
