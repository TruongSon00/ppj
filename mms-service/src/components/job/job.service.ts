import { PaginationQuery } from '@utils/pagination.query';
import { MAINTAIN_REQUEST_STATUS_ENUM } from '@components/maintain-request/maintain-request.constant';
import { Inject, Injectable } from '@nestjs/common';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { JobRepositoryInterface } from './interface/job.repository.interface';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { GetListJobRequestDto } from './dto/request/get-list-job.request.dto';
import { isEmpty, keyBy, flatMap, uniq, isNaN, compact } from 'lodash';
import { PagingResponse } from '@utils/paging.response';
import { plainToClass, plainToInstance } from 'class-transformer';
import { JobServiceInterface } from './interface/job.service.interface';
import { JobAssignmentRequestDto } from './dto/request/job-assignment.request.dto';
import { ApiError } from '@utils/api.error';
import { UserService } from '@components/user/user.service';
import {
  CAN_UPDATE_JOB_TYPE_EXECUTE,
  CAN_UPDATE_JOB_TYPE_CHECKLIST,
  LIST_VIRTUAL_KEY,
  JOB_TYPE_UPDATE_DEVICE_ASSIGN_HISTORY,
  JOB_STATUS_CAN_CREATE_SUPPLY_REQUEST,
  JOB_STATUS_CAN_DELETE,
} from './job.constant';
import {
  JOB_TYPE_ENUM,
  HISTORY_ACTION,
  JOB_STATUS_CAN_UPDATE_TO_INPROGRESS_OR_LATE,
  ASSIGN_TYPE,
  JOB_STATUS_ENUM,
  JOB_TYPE_MAINTENANCE_ENUM,
} from '@components/job/job.constant';
import { WarningRepositoryInterface } from '../warning/interface/warning.repository.interface';
import { MaintainRequestRepositoryInterface } from '../maintain-request/interface/maintain-request.repository.interface';
import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ChecklistJobRequestDto } from './dto/request/checklist-job.request.dto';
import { ApproveJobRequestDto } from './dto/request/approve-job.request.dto';
import {
  CAN_UPDATE_JOB_IMPLEMENT,
  CAN_UPDATE_JOB_REJECT,
  WARNING_STATUS_ENUM,
  CAN_UPDATE_JOB_ASSIGNMENTS,
} from './job.constant';
import { DetailJobResponse } from './dto/response/detail-job.response.dto';
import { ListJobResponse } from './dto/response/list-job.response.dto';
import { JobRejectRequestDto } from './dto/request/reject-job.request.dto';
import { JobImplementRequestDto } from './dto/request/implement-job.request.dto';
import { SupplyRepositoryInterface } from '@components/supply/interface/supply.repository.interface';
import { ProduceServiceInterface } from '@components/produce/interface/produce.service.interface';
import { RedoJobRequestDto } from './dto/request/redo-check-list.request.dto';
import { InprogressJobRequestDto } from './dto/request/inprogress-job.request.dto';
import { getUserRoleSettingName, plus } from '@utils/common';
import { DEVICE_ASIGNMENTS_STATUS_ENUM } from '@components/device-assignment/device-assignment.constant';
import { UpdateStatusJobRequestDto } from './dto/request/update-status.job.request';
import { ListJobProgressRequestDto } from './dto/request/report-job-progress-list.request.dto';
import {
  DEPARTMENT_PERMISSION_SETTING_CAN_SEE,
  DEPARTMENT_PERMISSION_SETTING,
} from '@utils/permissions/department-permission-setting';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { MaintenanceTeamRepositoryInterface } from '@components/maintenance-team/interface/maintenance-team.repository.interface';
import { DeviceAssignmentRepositoryInterface } from '@components/device-assignment/interface/device-assignment.repository.interface';
import { HistoryActionEnum } from '@components/history/history.constant';
import * as moment from 'moment';
import { checkIsSqlId } from '@utils/helper';
import { PlanRepositoryInterface } from '@components/plan/interface/plan.repository.interface';
import { PLAN_STATUS_ENUM } from '@components/plan/plan.constant';
import { ListProgressJobResponse } from './dto/response/list-progress-job.response';
import { MaintenanceTeamMemberRoleConstant } from '@components/maintenance-team/maintenance-team.constant';
import { DeviceRequestTicketRepositoryInterface } from '@components/device-request/interface/device-request-ticket.repository.interface';
import { CreateDeviceRequestTicketRequestDto } from '@components/device-request/dto/request/request-ticket/create-device-request-ticket.request.dto';
import { JobCreateSuppyRequestResponseDto } from './dto/response/list-job-create-supply-request.response.dto';
import { DeviceRequestServiceInterface } from '@components/device-request/interface/device-request.service.interface';
import {
  DEVICE_REQUEST_PREFIX_NAME,
  DEVICE_REQUEST_STATUS_ENUM,
} from '@components/device-request/device-request.constant';
import { DeviceRequestTicketStatus } from 'src/models/device-request-ticket/device-request-ticket.schema';
import { ResponsePayload } from '@utils/response-payload';
import { JobDraftRepositoryInterface } from './interface/job-draft.repository.interface';
import { DetailJobDraftResponse } from './dto/response/detail-job-draft.response.dto';
import { ReportJobDetailRequest } from './dto/request/report-job-detail.request.dto';
import { ReportJobRequest } from './dto/request/report-job.request.dto';
import { ReportJobResponseDto } from './dto/response/list-report-job.response.dto';
import { GetListJobByPlanIdRequestDto } from './dto/request/get-list-job-in-plan.request';
import { JobByPlanResponse } from './dto/response/job-by-plan.response';
import { UnitRepositoryInterface } from '@components/unit/interface/unit.repository.interface';

@Injectable()
export class JobService implements JobServiceInterface {
  constructor(
    @Inject('JobRepositoryInterface')
    private readonly jobRepository: JobRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
    @Inject('UserServiceInterface')
    private readonly userService: UserService,

    @Inject('WarningRepositoryInterface')
    private readonly warningRepository: WarningRepositoryInterface,

    @Inject('DeviceAssignmentRepositoryInterface')
    private readonly deviceAssignmentRepository: DeviceAssignmentRepositoryInterface,

    @Inject('DeviceRequestTicketRepositoryInterface')
    private readonly deviceRequestTicketRepository: DeviceRequestTicketRepositoryInterface,

    @Inject('MaintainRequestRepositoryInterface')
    private readonly maintainRequestRepository: MaintainRequestRepositoryInterface,

    @Inject('SupplyRepositoryInterface')
    private readonly supplyRepository: SupplyRepositoryInterface,

    @Inject('MaintenanceTeamRepositoryInterface')
    private readonly maintenanceTeamRepository: MaintenanceTeamRepositoryInterface,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceServiceInterface,

    @Inject('PlanRepositoryInterface')
    private readonly planRepository: PlanRepositoryInterface,

    @Inject('JobDraftRepositoryInterface')
    private readonly jobDraftRepository: JobDraftRepositoryInterface,

    @Inject('DeviceRequestServiceInterface')
    private readonly deviceRequestService: DeviceRequestServiceInterface,

    @Inject('UnitRepositoryInterface')
    private readonly unitRepository: UnitRepositoryInterface,

    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async listJob(payload: GetListJobRequestDto): Promise<any> {
    try {
      const userInItOrAdminDepartment = await this.checkRuleItOrAdmin(
        payload.user,
      );

      let teamAssign = false;
      let isTeamLead = false;
      let teamId;
      const userIdsFilter = [];

      if (!isEmpty(payload.filter)) {
        payload.filter.forEach((item) => {
          switch (item.column) {
            case 'assign':
              teamAssign = mongoose.isValidObjectId(item.text);
              if (teamAssign) teamId = item.text;
              else userIdsFilter.push(item.text);
              break;
            default:
              break;
          }
        });
      }

      const userIdsInTeam = [];

      if (teamAssign) {
        const team = await this.maintenanceTeamRepository.findOneById(teamId);
        team.members.forEach((e) => {
          if (
            payload.user.id == e.userId &&
            e.role === MaintenanceTeamMemberRoleConstant.LEADER
          ) {
            isTeamLead = true;
          }
          userIdsFilter.push(e.userId.toString());
        });
      }
      if (payload?.user) {
        const teams = await this.maintenanceTeamRepository.findAllByCondition({
          'members.userId': payload.user.id,
        });
        teams.forEach((e) => {
          userIdsInTeam.push(e._id.toString());
          e.members.forEach((v) => {
            if (
              payload.user.id == v.userId &&
              v.role === MaintenanceTeamMemberRoleConstant.LEADER
            ) {
              isTeamLead = true;
            }
            userIdsInTeam.push(v.userId.toString());
          });
        });
      }

      const { pageIndex, total, data } = await this.jobRepository.getListJob(
        payload,
        userInItOrAdminDepartment,
        userIdsInTeam,
        userIdsFilter,
        isTeamLead,
        teamId,
      );
      const userIds = [];
      const teamIds = [];

      data.forEach((job) => {
        if (job?.assign?.type === ASSIGN_TYPE.TEAM && job?.assign?.assignId) {
          teamIds.push(job?.assign?.assignId);
        }
        if (
          (job?.assign?.type === ASSIGN_TYPE.USER || !job?.assign?.type) &&
          job?.assign?.assignId
        ) {
          userIds.push(job?.assign?.assignId);
        }
        const key = Object.keys(job).find(
          (e) => LIST_VIRTUAL_KEY.includes(e) && job[e].length > 0,
        );
        if (!isEmpty(job[key]) && isEmpty(job[key][0]?.deviceAssignment)) {
          job[key][0].deviceAssignment = job.deviceAssignment;
        }
      });

      const users = await this.userService.listUserByIds(userIds);
      const teams = await this.maintenanceTeamRepository.findAllByCondition({
        _id: { $in: teamIds },
      });
      const userItem = keyBy(users.data, 'id');
      const teamItem = keyBy(teams, '_id');

      const finalData = data.map((job) => {
        const assignee = this.getAssignee(job?.assign, userItem, teamItem);
        const cloneKey = this.getVirtualKey(job.type);
        job[cloneKey] =
          job[cloneKey]?.length > 0
            ? job[cloneKey]
            : [
                {
                  code: job.code,
                  name: job.name || '',
                  description: job.description,
                  deviceAssignment: job.deviceAssignment,
                  priority: job?.priority || 1,
                  type: job?.type,
                  checkType: job?.type,
                },
              ];
        return {
          ...job,
          assign: assignee,
        };
      });

      const response = plainToInstance(ListJobResponse, finalData, {
        excludeExtraneousValues: true,
      });
      return new ResponseBuilder<PagingResponse>({
        items: !isEmpty(response) ? response : [],
        meta: { total: total, page: pageIndex },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    }
  }

  async updateAssignment(request: JobAssignmentRequestDto): Promise<any> {
    const { id, assignUser, user, planId, planFrom, planTo } = request;

    const plan = await this.planRepository.findOneByCondition({
      _id: planId,
      deletedAt: null,
    });
    if (!plan) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }
    if (plan.status !== PLAN_STATUS_ENUM.CONFIRMED) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.PLAN_NOT_CONFIRMED'),
      ).toResponse();
    }
    if (
      moment(plan.planFrom).isAfter(moment(planFrom), 'day') ||
      moment(plan.planTo).isBefore(moment(planTo), 'day')
    ) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.DATE_MUST_BE_IN_THE_PLAN'),
      ).toResponse();
    }

    const job = await this.jobRepository.findOneById(id);
    if (!job) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.JOB_NOT_FOUND'),
      ).toResponse();
    }
    if (!CAN_UPDATE_JOB_ASSIGNMENTS.includes(job.status)) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_ACCEPTABLE'),
      ).toResponse();
    }

    let assign = null;
    if (checkIsSqlId(assignUser)) {
      const assignee = await this.userService.detailUser(+assignUser, true);
      assign = {
        assignId: assignUser,
        assignName: assignee?.username,
        type: ASSIGN_TYPE.USER,
      };
    } else if (mongoose.isValidObjectId(assignUser)) {
      const assignee = await this.maintenanceTeamRepository.findOneById(
        assignUser,
      );
      assign = {
        assignId: assignUser,
        assignName: assignee?.name,
        type: ASSIGN_TYPE.TEAM,
      };
    }
    if (!assign) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.ASSIGN_USER_NOT_FOUND'),
      ).toResponse();
    }
    const history = {
      content: (await this.i18n.translate('text.userAssignedJobTo'))
        .replace('{username}', user?.username)
        .replace('{assignee}', assign.assignName),
      userId: user.id,
      createdAt: new Date(),
      action: HISTORY_ACTION.UPDATED,
      status: JOB_STATUS_ENUM.NON_ASSIGN,
    };
    try {
      await this.jobRepository.updateJobAssignment({
        ...request,
        assign,
        history,
      });
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    }
  }

  async updateExecute(request: any): Promise<any> {
    const { id, user } = request;
    const job = await this.jobRepository.findOneById(id);
    if (!job) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.JOB_NOT_FOUND'),
      ).toResponse();
    }
    if (!CAN_UPDATE_JOB_TYPE_EXECUTE.includes(job.type)) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_ACCEPTABLE'),
      ).toResponse();
    }

    const checkPermission = await this.authorizedJob(user, job);
    if (!checkPermission) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_ACCEPTABLE'),
      ).toResponse();
    }

    const history = {
      content: (await this.i18n.translate('text.userHasExecutedJob')).replace(
        '{username}',
        user.username,
      ),
      userId: user.id,
      createdAt: new Date(),
      action: HISTORY_ACTION.UPDATED,
      status: JOB_STATUS_ENUM.COMPLETED,
    };
    request.history = history;

    const session = await this.connection.startSession();
    session.startTransaction();
    if (job.type === JOB_TYPE_ENUM.INSTALLATION) {
      job.result = request.result;
    }
    try {
      this.jobRepository.updateJobExecute(job, request);
      await this.updateWarningOrMaintainRequestStatus(job, 'EXECUTED', user);
      await session.commitTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      await session.abortTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    } finally {
      await session.endSession();
    }
  }

  async updateChecklist(request: ChecklistJobRequestDto): Promise<any> {
    const {
      id,
      details,
      checkType,
      description,
      checklistConclude,
      checklistResult,
      user,
    } = request;
    const job = await this.jobRepository.findOneById(id);
    if (!job) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.JOB_NOT_FOUND'),
      ).toResponse();
    }
    if (!CAN_UPDATE_JOB_TYPE_CHECKLIST.includes(job.type)) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_ACCEPTABLE'),
      ).toResponse();
    }
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const data = {
        checklistTemplateId: job.jobTypeId,
        details: details,
        checkType,
        description,
        checklistConclude,
        checklistResult,
      };
      await Promise.all([
        this.jobRepository.updateJobChecklist(request),
        this.warningRepository.updateDetails(data),
      ]);
      await this.updateWarningOrMaintainRequestStatus(job, 'EXECUTED', user);
      await session.commitTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      await session.abortTransaction();
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    } finally {
      await session.endSession();
    }
  }

  async updateApprove(request: ApproveJobRequestDto): Promise<any> {
    try {
      const { id, user } = request;
      const job = await this.jobRepository.findOneById(id);
      if (!job) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.JOB_NOT_FOUND'),
        ).toResponse();
      }

      const checkPermission = await this.authorizedJob(user, job);
      if (!checkPermission) {
        return new ApiError(
          ResponseCodeEnum.NOT_FOUND,
          await this.i18n.translate('error.NOT_ACCEPTABLE'),
        ).toResponse();
      }

      const detailUser = await this.userService.detailUser(user.id);
      if (detailUser.statusCode !== ResponseCodeEnum.SUCCESS) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }
      const history = {
        content: (await this.i18n.translate('text.userNotExecutedJob')).replace(
          '{username}',
          detailUser.data.username,
        ),
        userId: user.id,
        createdAt: new Date(),
        action: HISTORY_ACTION.UPDATED,
        status: JOB_STATUS_ENUM.IN_PROGRESS,
      };
      request.history = history;
      await this.jobRepository.updateJobApprove(request);
      await this.updateWarningOrMaintainRequestStatus(
        job,
        'NOT_EXECUTED',
        detailUser.data,
      );
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    }
  }

  async detail(id: string): Promise<any> {
    const jobs = await this.jobRepository.getDetailJob(id);
    if (isEmpty(jobs))
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.JOB_NOT_FOUND'),
      ).toResponse();
    const job = jobs[0];
    let supplyIds = [];
    let actualSupplyIds = [];
    let actualSupplyObjs = [];

    if (job.type === JOB_TYPE_ENUM.MAINTENANCE_REQUEST) {
      supplyIds = job.maintainRequest[0].supplies.map(
        (supply) => supply.supplyId,
      );
      actualSupplyIds = job.actualSupplies.map((supply) => supply.supplyId);
      actualSupplyObjs = { ...job.actualSupplies };
    }
    if (job.type === JOB_TYPE_ENUM.PERIOD_MAINTAIN) {
      supplyIds = (job.maintenancePeriodWarning[0]?.supplies || [])?.map(
        (supply) => supply.supplyId,
      );
      actualSupplyIds = (job.actualSupplies || [])?.map(
        (supply) => supply.supplyId,
      );
      actualSupplyObjs = { ...job.actualSupplies };
    }
    if (job.type === JOB_TYPE_ENUM.WARNING) {
      supplyIds = job.warning[0].supplies.map((supply) => supply.supplyId);
      actualSupplyIds = job.actualSupplies.map((supply) => supply.supplyId);
      actualSupplyObjs = { ...job.actualSupplies };
    }
    if (job.type === JOB_TYPE_ENUM.PERIOD_CHECKLIST) {
      job.checklistTemplate[0] = {
        ...job.checklistTemplate[0],
        checklistResult: job?.result?.checklist.result ?? null,
        checklistConclude: job?.result?.checklist.conclude ?? null,
      };
    }
    if (job.type === JOB_TYPE_ENUM.INSTALLATION) {
      job.installationTemplate[0] = {
        ...job.installationTemplate[0],
        ...job.result,
      };
    }

    const supplies = await this.supplyRepository.getByIds([
      ...supplyIds,
      ...actualSupplyIds,
    ]);
    const supplyItem = keyBy(supplies, '_id');
    const actualSuppliesById = keyBy(actualSupplyObjs, 'supplyId');

    let assign = null;
    if (
      job?.assign &&
      (job?.assign?.type === ASSIGN_TYPE.USER || !job?.assign?.type)
    ) {
      const assignee = await this.userService.detailUser(
        +job.assign.assignId,
        true,
      );
      assign = {
        userId: job.assign.assignId,
        name: assignee?.username,
        fullName: assignee?.fullName,
      };
    } else if (job?.assign && job?.assign?.type === ASSIGN_TYPE.TEAM) {
      const assignee = await this.maintenanceTeamRepository.findOneById(
        job.assign.assignId,
      );
      assign = {
        userId: job.assign.assignId,
        name: assignee?.name,
        fullName: assignee?.name,
      };
    }

    const { userDetail } = await this.getUserInfo(
      job.deviceAssignment[0].userId,
    );

    const factory = await this.userService.getFactoryById(
      job.deviceAssignment[0].factoryId,
    );

    const workCenter = await this.produceService.getDetailWorkCenter(
      job.deviceAssignment[0]?.workCenterId,
    );

    const key = Object.keys(job).find(
      (e) => LIST_VIRTUAL_KEY.includes(e) && job[e].length > 0,
    );
    if (key)
      job[key] = [
        {
          ...job[key][0],
          factory,
          workCenter,
          deviceAssignment: job.deviceAssignment.map((assign) => ({
            ...assign,
            user: userDetail,
            factory,
            workCenter,
          })),
          supplies: !isEmpty(supplies)
            ? job.supplies?.map((supply) => ({
                ...supplyItem[supply.supplyId],
                quantity: supply.quantity || 0,
                maintainType: supply.maintenanceType || 0,
              }))
            : [],
          actualSupplies: !isEmpty(job.actualSupplies)
            ? job.actualSupplies?.map((supply) => ({
                ...supplyItem[supply.supplyId],
                ...(actualSuppliesById[supply.supplyId] || {}),
                quantity: supply.quantity,
                maintainType: supply.maintenanceType || 0,
                _id: supply.supplyId,
              }))
            : [],
        },
      ];
    else {
      const cloneKey = this.getVirtualKey(job.type);
      job[cloneKey] = [
        {
          code: job.code,
          name: job.name || '',
          description: job.description || '',
          priority: job?.priority || 1,
          type: job.type,
          checkType: 0,
          checklistResult: job?.result?.checklist?.result ?? null,
          checklistConclude: job?.result?.checklist?.conclude ?? null,
          factory,
          workCenter,
          deviceAssignment: job.deviceAssignment.map((assign) => ({
            ...assign,
            user: userDetail,
            factory,
            workCenter,
          })),
          supplies: !isEmpty(supplies)
            ? job.supplies?.map((supply) => ({
                ...supplyItem[supply.supplyId],
                quantity: supply.quantity || 0,
                maintainType: supply.maintenanceType || 0,
              }))
            : [],
          actualSupplies: !isEmpty(job.actualSupplies)
            ? job.actualSupplies?.map((supply) => ({
                ...supplyItem[supply.supplyId],
                ...(actualSuppliesById[supply.supplyId] || {}),
                quantity: supply.quantity,
                maintainType: supply.maintenanceType || 0,
                _id: supply.supplyId,
              }))
            : [],
        },
      ];
    }
    const result = {
      ...job,
      maintenanceType:
        job?.result?.maintenanceType || JOB_TYPE_MAINTENANCE_ENUM.MAINTENANCE,
      assignUsers: assign,
      estMaintenance: plus(
        job.deviceAssignment[0]?.information?.mttaIndex || 0,
        job.deviceAssignment[0]?.information?.mttrIndex || 0,
      ),
    };
    const dataReturn = plainToInstance(DetailJobResponse, result, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async updateReject(request: JobRejectRequestDto): Promise<any> {
    const { id, user } = request;
    const job = await this.jobRepository.findOneById(id);
    if (!job) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.JOB_NOT_FOUND'),
      ).toResponse();
    }
    if (!CAN_UPDATE_JOB_REJECT.includes(job.status)) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_ACCEPTABLE'),
      ).toResponse();
    }
    const checkPermission = await this.authorizedJob(user, job);
    if (!checkPermission) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_ACCEPTABLE'),
      ).toResponse();
    }
    const detailUser = await this.userService.detailUser(user.id);
    if (detailUser.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    const history = {
      content: (await this.i18n.translate('text.userHasRejectedJob')).replace(
        '{username}',
        detailUser.data.username,
      ),
      userId: user.id,
      createdAt: new Date(),
      action: HISTORY_ACTION.UPDATED,
      status: JOB_STATUS_ENUM.REJECTED,
      reason: request.reason,
    };
    request.history = history;
    try {
      await this.jobRepository.updateJobReject(request);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    }
  }

  async updateImplement(request: JobImplementRequestDto): Promise<any> {
    const { id, user } = request;
    const job = await this.jobRepository.findOneById(id);
    if (!job) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.JOB_NOT_FOUND'),
      ).toResponse();
    }
    const checkPermission = await this.authorizedJob(user, job);
    if (!checkPermission) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_ACCEPTABLE'),
      ).toResponse();
    }
    const detailUser = await this.userService.detailUser(user.id);
    if (detailUser.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    const history = {
      content: (await this.i18n.translate('text.userConfirmedJob')).replace(
        '{username}',
        detailUser.data.username,
      ),
      userId: user.id,
      createdAt: new Date(),
      status: JOB_STATUS_ENUM.TO_DO,
    };
    request.history = history;
    if (!CAN_UPDATE_JOB_IMPLEMENT.includes(job.status)) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_ACCEPTABLE'),
      ).toResponse();
    }
    try {
      await this.jobRepository.updateJobImplement(request);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    }
  }

  async getUserInfo(id: number) {
    let userDetail = {};
    const user = await this.userService.detailUser(id);

    if (user.data) {
      const detailCompany = await this.userService.detailCompany(
        user.data.companyId,
      );
      userDetail = {
        ...user.data,
        ...{
          companyName: detailCompany.data.name,
          address: detailCompany.data.address,
        },
      };
    }

    return { user, userDetail };
  }

  async updateRedo(request: RedoJobRequestDto): Promise<any> {
    const { id, user } = request;
    const job = await this.jobRepository.findOneById(id);
    if (!job) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.JOB_NOT_FOUND'),
      ).toResponse();
    }
    const checkPermission = await this.authorizedJob(user, job);
    if (!checkPermission) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_ACCEPTABLE'),
      ).toResponse();
    }
    const detailUser = await this.userService.detailUser(user.id);
    if (detailUser.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    const history = {
      content: (await this.i18n.translate('text.userReworkJob')).replace(
        '{username}',
        detailUser.data.username,
      ),
      userId: user.id,
      createdAt: new Date(),
      action: HISTORY_ACTION.UPDATED,
      status: JOB_STATUS_ENUM.IN_PROGRESS,
    };
    let isLateInProgress = false;
    if (moment(job.planTo).isBefore(moment(), 'day')) {
      isLateInProgress = true;
    }
    request.history = history;
    try {
      await this.jobRepository.updateJobRedo(request, isLateInProgress);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    }
  }

  async updateInprogress(request: InprogressJobRequestDto): Promise<any> {
    const { id, user } = request;
    const job = await this.jobRepository.findOneById(id);
    if (!job) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.JOB_NOT_FOUND'),
      ).toResponse();
    }
    if (!JOB_STATUS_CAN_UPDATE_TO_INPROGRESS_OR_LATE.includes(job.status)) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_ACCEPTABLE'),
      ).toResponse();
    }
    const checkPermission = await this.authorizedJob(user, job);
    if (!checkPermission) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_ACCEPTABLE'),
      ).toResponse();
    }
    const detailUser = await this.userService.detailUser(user.id);
    if (detailUser.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    try {
      let history = {
        content: `${detailUser.data.username} đang thực hiện công việc`,
        userId: user.id,
        createdAt: new Date(),
        action: HISTORY_ACTION.UPDATED,
        status: JOB_STATUS_ENUM.IN_PROGRESS,
      };
      let isLateInProgress = false;
      if (moment(job.planTo).isBefore(moment(), 'day')) {
        history = {
          content: `${detailUser.data.username} đang thực hiện công việc quá hạn`,
          userId: user.id,
          createdAt: new Date(),
          action: HISTORY_ACTION.UPDATED,
          status: JOB_STATUS_ENUM.IN_PROGRESS,
        };
        isLateInProgress = true;
      }
      request.history = history;
      const data = {
        ...request,
        executionDateFrom: new Date(),
        isLateInProgress,
      };
      const res = await this.jobRepository.updateJobInprogress(data);
      await this.updateWarningOrMaintainRequestStatus(
        job,
        'IN_PROGRESS',
        detailUser.data,
      );
      await this.updateDeviceAssignmentStatus(job, 'IN_MAINTAINING', user.id);
      return new ResponseBuilder(res)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    }
  }

  async resolvedJob(request: UpdateStatusJobRequestDto): Promise<any> {
    const { id, user } = request;
    const job = await this.jobRepository.findOneById(id);
    if (!job) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.JOB_NOT_FOUND'),
      ).toResponse();
    }
    if (job.status !== JOB_STATUS_ENUM.COMPLETED) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.JOB_STATUS_INVALID'),
      ).toResponse();
    }
    const checkPermission = await this.authorizedJob(user, job);
    if (!checkPermission) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_ACCEPTABLE'),
      ).toResponse();
    }
    const detailUser = await this.userService.detailUser(user.id);
    if (detailUser.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }
    try {
      await this.jobRepository.findByIdAndUpdate(id, {
        status: JOB_STATUS_ENUM.RESOLVED,
        $push: {
          histories: {
            content: `${detailUser.data.username} đã hoàn thành công việc`,
            userId: user.id,
            createdAt: new Date(),
            action: HISTORY_ACTION.UPDATED,
            status: JOB_STATUS_ENUM.RESOLVED,
          },
        },
      });

      await this.updateWarningOrMaintainRequestStatus(
        job,
        'COMPLETED',
        detailUser.data,
      );

      if (JOB_TYPE_UPDATE_DEVICE_ASSIGN_HISTORY.includes(job.type)) {
        await this.deviceAssignmentRepository.findByIdAndUpdate(
          job.deviceAssignmentId,
          {
            $push: {
              histories: {
                userId: user.id,
                action: HistoryActionEnum.UPDATE,
                createdAt: new Date(),
                planCode: job.code,
                planFrom: job.planFrom,
                planTo: job.planTo,
                jobType: job.type,
                jobId: job._id,
              },
            },
          },
        );
      }

      if (job?.result?.maintenanceType === JOB_TYPE_MAINTENANCE_ENUM.REPLACE) {
        await this.updateDeviceAssignmentStatus(job, 'IN_SCRAPPING', user.id);
      } else {
        await this.deviceAssignmentRepository.findByIdAndUpdate(
          job.deviceAssignmentId,
          {
            status: DEVICE_ASIGNMENTS_STATUS_ENUM['IN_USE'],
            // $push: {
            //   histories: history,
            // },
          },
        );
      }
      const deviceAssignment =
        await this.deviceAssignmentRepository.detailDeviceAssignment(
          job.deviceAssignmentId,
        );

      if (job.type === JOB_TYPE_ENUM.INSTALLATION) {
        const deviceRequestTicket =
          await this.deviceRequestTicketRepository.findOneById(
            deviceAssignment[0].deviceRequestId,
          );

        const deviceAssginments =
          await this.deviceAssignmentRepository.findAllByCondition({
            deviceRequestId: deviceAssignment[0].deviceRequestId,
            deletedAt: null,
            status: DEVICE_ASIGNMENTS_STATUS_ENUM.IN_USE,
          });

        if (deviceAssginments.length === deviceRequestTicket.quantity) {
          deviceRequestTicket.status = DEVICE_REQUEST_STATUS_ENUM.INSTALLED;
          await deviceRequestTicket.save();
        }
      }

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    }
  }

  async reworkJob(request: UpdateStatusJobRequestDto): Promise<any> {
    const { id, user, reason } = request;
    const job = await this.jobRepository.findOneById(id);
    if (!job) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.JOB_NOT_FOUND'),
      ).toResponse();
    }
    if (job.status !== JOB_STATUS_ENUM.COMPLETED) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.JOB_STATUS_INVALID'),
      ).toResponse();
    }
    const checkPermission = await this.authorizedJob(user, job);
    if (!checkPermission) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_ACCEPTABLE'),
      ).toResponse();
    }
    const detailUser = await this.userService.detailUser(user.id);
    if (detailUser.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }
    try {
      let isLateInProgress = false;
      if (moment(job.planTo).isBefore(moment(), 'day')) {
        isLateInProgress = true;
      }
      const status = isLateInProgress
        ? JOB_STATUS_ENUM.LATE
        : JOB_STATUS_ENUM.IN_PROGRESS;
      this.jobRepository.findByIdAndUpdate(id, {
        status,
        $push: {
          histories: {
            content: `${detailUser.data.username} đã yêu cầu làm lại công việc`,
            userId: user.id,
            createdAt: new Date(),
            action: HISTORY_ACTION.UPDATED,
            reason: reason,
            status,
          },
        },
      });
      await this.updateWarningOrMaintainRequestStatus(
        job,
        'IN_PROGRESS',
        detailUser?.data,
        true,
      );
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    }
  }

  async jobProgressList(request: ListJobProgressRequestDto): Promise<any> {
    try {
      const checkPermission = this.checkRuleItOrAdmin(request.user);

      if (!checkPermission) {
        return new ApiError(
          ResponseCodeEnum.FORBIDDEN,
          await this.i18n.translate('error.FORBIDDEN'),
        ).toResponse();
      }

      const { data, count } = await this.jobRepository.getListJobProgress(
        request,
      );
      const dataReturn = plainToInstance(ListProgressJobResponse, data, {
        excludeExtraneousValues: true,
      });

      return new ResponseBuilder({
        items: dataReturn,
        meta: { total: count, page: request.page, size: request.limit },
      })
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    }
  }

  private async checkRuleItOrAdmin(user: UserInforRequestDto): Promise<any> {
    const userDetail = await this.userService.getUserById(user.id);
    let checkPermission = false;
    userDetail.departmentSettings.forEach((department) => {
      if (DEPARTMENT_PERMISSION_SETTING_CAN_SEE.includes(department.id)) {
        checkPermission = true;
      }
    });

    return checkPermission;
  }
  private async updateWarningOrMaintainRequestStatus(
    job,
    status,
    user,
    isRework = false,
  ) {
    if (
      job.type === JOB_TYPE_ENUM.WARNING ||
      job.type === JOB_TYPE_ENUM.PERIOD_CHECKLIST ||
      job.type === JOB_TYPE_ENUM.PERIOD_MAINTAIN
    ) {
      await this.warningRepository.findByIdAndUpdate(job.jobTypeId, {
        status: WARNING_STATUS_ENUM[status],
      });
    }
    if (job.type === JOB_TYPE_ENUM.MAINTENANCE_REQUEST) {
      const t =
        status === 'NOT_EXECUTED'
          ? 'text.NOT_EXECUTED_MAINTAIN_REQUEST_HISTORY'
          : status === 'REJECTED'
          ? 'text.REJECTED_MAINTAIN_REQUEST_HISTORY'
          : status === 'IN_PROGRESS'
          ? !isRework
            ? 'text.IN_PROGRESS_MAINTAIN_REQUEST_HISTORY'
            : 'text.RE_DO_MAINTAIN_REQUEST_HISTORY'
          : status === 'EXECUTED'
          ? 'text.EXECUTED_MAINTAIN_REQUEST_HISTORY'
          : 'text.COMPLETED_MAINTAIN_REQUEST_HISTORY';
      const text = await this.i18n.translate(t);
      await this.maintainRequestRepository.findByIdAndUpdate(job.jobTypeId, {
        status: MAINTAIN_REQUEST_STATUS_ENUM[status],
        $push: {
          histories: {
            userId: user.id,
            action: HISTORY_ACTION.UPDATED,
            content: `${user.username} ${text}`,
            status: MAINTAIN_REQUEST_STATUS_ENUM[status],
          },
        },
      });
    }
  }

  private async updateDeviceAssignmentStatus(job, status, userId) {
    const history = {
      userId: userId,
      action: HistoryActionEnum.UPDATE,
      createdAt: new Date(),
      status: DEVICE_ASIGNMENTS_STATUS_ENUM[status],
    };
    if (job.type !== JOB_TYPE_ENUM.INSTALLATION)
      await this.deviceAssignmentRepository.findByIdAndUpdate(
        job.deviceAssignmentId,
        {
          status: DEVICE_ASIGNMENTS_STATUS_ENUM[status],
          $push: {
            histories: history,
          },
        },
      );
  }

  private getVirtualKey(jobType: number): string {
    let cloneKey;
    switch (jobType) {
      case JOB_TYPE_ENUM.MAINTENANCE_REQUEST:
        cloneKey = LIST_VIRTUAL_KEY[0];
        break;
      case JOB_TYPE_ENUM.PERIOD_CHECKLIST:
        cloneKey = LIST_VIRTUAL_KEY[1];
        break;
      case JOB_TYPE_ENUM.PERIOD_MAINTAIN:
        cloneKey = LIST_VIRTUAL_KEY[3];
        break;
      case JOB_TYPE_ENUM.WARNING:
        cloneKey = LIST_VIRTUAL_KEY[2];
        break;
      case JOB_TYPE_ENUM.INSTALLATION:
        cloneKey = LIST_VIRTUAL_KEY[4];
        break;
      default:
        break;
    }
    return cloneKey;
  }

  async getListJobCreateSupplyRequest(request: PaginationQuery): Promise<any> {
    const jobs = await this.jobRepository.findAndPopulate(
      {
        status: { $in: JOB_STATUS_CAN_CREATE_SUPPLY_REQUEST },
        type: { $ne: JOB_TYPE_ENUM.PERIOD_CHECKLIST },
      },
      {
        path: 'deviceAssignmentId',
        populate: {
          path: 'deviceId',
          model: 'Device',
          populate: [
            {
              path: 'information.supplies.supplyId',
              model: 'Supply',
            },
          ],
        },
      },
    );

    const deviceAssignments = flatMap(jobs, 'deviceAssignmentId');
    const factoryIds = compact(uniq(flatMap(deviceAssignments, 'factoryId')));
    let factories = [];
    let workCenters = [];
    let units = [];
    if (!isEmpty(factoryIds)) {
      const factoryList = await this.userService.getFactoryList({
        filter: [
          {
            column: 'factoryIds',
            text: factoryIds.filter((id) => id).join(','),
          },
        ],
      });
      factories = keyBy(factoryList.data, 'id') as any[];
    }

    const workCenterIds = compact(
      uniq(flatMap(deviceAssignments, 'workCenterId')),
    );
    if (!isEmpty(workCenterIds)) {
      const workCenterList = await this.produceService.getWorkCenters({
        filter: [
          {
            column: 'workCenterIds',
            text: workCenterIds.filter((id) => id).join(','),
          },
        ],
      });
      workCenters = keyBy(workCenterList?.items, 'id') as any[];
    }
    const information = flatMap(
      deviceAssignments,
      'deviceId.information.supplies',
    );
    const unitIds = compact(
      uniq(information.map((infor) => infor.supplyId.itemUnitId)),
    );

    if (!isEmpty(unitIds)) {
      const unitData = await this.unitRepository.findAllByCondition({
        _id: {
          $in: unitIds,
        },
      });
      units = keyBy(unitData, '_id') as any;
    }

    const data = jobs.map((job) => {
      const deviceAssignment = job.deviceAssignmentId;
      const device = deviceAssignment.deviceId;
      return {
        _id: job._id,
        code: job.code,
        type: job.type,
        name: job?.name || null,
        deviceAssignment: {
          _id: deviceAssignment._id,
          serial: deviceAssignment.serial,
          name: device.name,
          workCenter: workCenters[deviceAssignment.workCenterId] || null,
          factory: factories[deviceAssignment.factoryId] || null,
          sparePartDetails: device.information.supplies.map((supply) => ({
            _id: supply.supplyId._id,
            code: supply.supplyId.code,
            name: supply.supplyId.name,
            type: supply.supplyId.type,
            price: supply.supplyId.price,
            unit: units[supply.supplyId.itemUnitId]?.name,
            quantity: supply.quantity,
          })),
        },
      };
    });
    const res = plainToInstance(JobCreateSuppyRequestResponseDto, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(res)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  private async authorizedJob(
    user: UserInforRequestDto,
    job: any,
  ): Promise<boolean> {
    let count = 0;
    const userIds = [];
    const teamIds = [];
    user = await this.userService.getUserById(user.id);
    for (let i = 0; i < user.departmentSettings.length; i++) {
      if (
        user.departmentSettings[i].id === DEPARTMENT_PERMISSION_SETTING.ADMIN
      ) {
        return true;
      } else if (
        user.departmentSettings[i].id !== DEPARTMENT_PERMISSION_SETTING.IT
      )
        count++;
    }

    if (count === user.departmentSettings.length) return false;
    const isJobAssignForCurrentUser = +job.assign.assignId === +user.id;
    if (isJobAssignForCurrentUser) return true;

    job.assign.type === ASSIGN_TYPE.USER
      ? userIds.push(+job.assign.assignId)
      : teamIds.push(job.assign.assignId);

    const teams = await this.maintenanceTeamRepository.findAllByCondition({
      $or: [
        {
          _id: {
            $in: teamIds,
          },
        },
        {
          'members.userId': {
            $in: userIds,
          },
        },
      ],
    });

    let permission = false;

    teams.forEach((team) => {
      team.members.forEach((member) => {
        if (member.userId === user.id) {
          permission = true;
        }
      });
    });

    return permission;
  }

  private getAssignee(assign, userItem, teamItem) {
    if (isEmpty(assign)) {
      return null;
    }
    let assignObj = userItem;
    if (assign.type === ASSIGN_TYPE.TEAM) {
      assignObj = teamItem;
    }
    const assignee = assignObj[assign.assignId];
    return assignee
      ? {
          ...assign,
          userId: assignee?.id,
          username: assignee?.username ?? assignee?.name,
          fullname: assignee?.fullName ?? assignee?.name,
        }
      : null;
  }

  async detailJobDraft(id: string): Promise<ResponsePayload<any>> {
    let jobDraft = await this.jobDraftRepository.detail(id);
    if (isEmpty(jobDraft)) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    let factoryResponse;
    let workCenterResponse;

    if (jobDraft?.deviceAssignmentId?.factoryId)
      factoryResponse = await this.userService.detailFactory(
        jobDraft?.deviceAssignmentId?.factoryId,
      );

    if (jobDraft?.deviceAssignmentId?.workCenterId)
      workCenterResponse = await this.produceService.getDetailWorkCenter(
        jobDraft?.deviceAssignmentId?.workCenterId,
      );

    const factory = {
      id: factoryResponse?.data?.id,
      description: factoryResponse?.data?.description,
      name: factoryResponse?.data?.name,
      location: factoryResponse?.data?.location,
      companyId: factoryResponse?.data?.companyId,
      code: factoryResponse?.data?.code,
      phone: factoryResponse?.data?.phone,
    };

    const workCenter = {
      id: workCenterResponse?.id,
      code: workCenterResponse?.code,
      name: workCenterResponse?.name,
    };

    if (jobDraft.type === JOB_TYPE_ENUM.PERIOD_MAINTAIN) {
      jobDraft = {
        ...jobDraft._doc,
        maintenancePeriodWarning: {
          deviceAssignment: {
            ...jobDraft.deviceAssignmentId._doc,
            device: jobDraft.deviceAssignmentId.deviceId,
          },
          factory,
          workCenter,
        },
      };
    }

    if (jobDraft.type === JOB_TYPE_ENUM.PERIOD_CHECKLIST) {
      jobDraft = {
        ...jobDraft._doc,
        checklistTemplate: {
          deviceAssignment: {
            ...jobDraft.deviceAssignmentId._doc,
            device: jobDraft.deviceAssignmentId.deviceId,
          },
          factory,
          workCenter,
        },
      };
    }

    const dataReturn = plainToInstance(DetailJobDraftResponse, jobDraft, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async reportJob(request: ReportJobRequest): Promise<ResponsePayload<any>> {
    const users = await this.userService.getUserListByDepartmentWithPagination(
      request.filter,
      request.page,
      request.limit,
      request.sort,
      request.keyword,
    );

    const assignIds = [];
    users.items.forEach((user) => {
      assignIds.push(user.id.toString());
    });

    const teamIds = [];
    const jobByTeam = new Map();
    const teamByUser = new Map();
    const jobByUser = new Map();

    const teamsHasUser =
      await this.maintenanceTeamRepository.findAllByCondition({
        'members.userId': {
          $in: assignIds.map((e) => +e),
        },
      });

    if (!isEmpty(teamsHasUser)) {
      teamsHasUser.forEach((team) => {
        assignIds.push(team._id.toString());
      });

      teamsHasUser.forEach((team) => {
        team.members.forEach((member) => {
          teamByUser.set(member.userId, team._id.toString());
        });
      });
    }

    // count job in database
    const reportJobs = await this.jobRepository.reportJob(request, assignIds);

    reportJobs.forEach((report) => {
      if (isNaN(+report._id)) {
        teamIds.push(report._id);
        jobByTeam.set(report._id.toString(), report);
      } else {
        jobByUser.set(+report._id, report);
      }
    });

    // map count job by user
    const dataReturn = users.items.map((user) => {
      const {
        successQuantity,
        executeQuantity,
        lateQuantity,
        planQuantity,
        incurredQuantity,
        waitQuantity,
        totalQuantity,
      } = this.calculateJobQuantity(jobByUser, teamByUser, jobByTeam, user.id);

      return {
        userId: user.id,
        userCode: user.code,
        fullName: user.fullName,
        userRole: user.userRole, //??
        startWork: user.startWork,
        totalQuantity,
        successQuantity,
        executeQuantity,
        lateQuantity,
        waitQuantity,
        planQuantity,
        incurredQuantity,
      };
    });

    const response = plainToInstance(ReportJobResponseDto, dataReturn, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder({
      items: response,
      meta: {
        total: users?.meta?.total || 0,
        page: request.page,
        size: request.limit,
      },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async reportJobDetail(
    request: ReportJobDetailRequest,
  ): Promise<ResponsePayload<any>> {
    const user = await this.userService.getUserById(+request.id);

    if (!user) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    const assignIds = [request.id.toString()];

    const teamIds = [];
    const jobByTeam = new Map();
    const teamByUser = new Map();
    const jobByUser = new Map();

    const teamsHasUser =
      await this.maintenanceTeamRepository.findAllByCondition({
        'members.userId': +request.id,
      });

    if (!isEmpty(teamsHasUser)) {
      teamsHasUser.forEach((team) => {
        assignIds.push(team._id.toString());
      });

      teamsHasUser.forEach((team) => {
        team.members.forEach((member) => {
          teamByUser.set(member.userId, team._id.toString());
        });
      });
    }

    // count job in database
    const reportJobs = await this.jobRepository.reportJobDetail(assignIds);

    reportJobs.forEach((report) => {
      if (isNaN(+report._id)) {
        teamIds.push(report._id);
        jobByTeam.set(report._id.toString(), report);
      } else {
        jobByUser.set(+report._id, report);
      }
    });

    // map count job by user
    const {
      successQuantity,
      executeQuantity,
      lateQuantity,
      planQuantity,
      incurredQuantity,
      waitQuantity,
      totalQuantity,
    } = this.calculateJobQuantity(jobByUser, teamByUser, jobByTeam, user.id);

    const dataReturn = {
      userId: user.id,
      userCode: user.code,
      fullName: user.fullName,
      userRole: getUserRoleSettingName(user),
      startWork: user.createdAt,
      totalQuantity,
      successQuantity,
      executeQuantity,
      lateQuantity,
      waitQuantity,
      planQuantity,
      incurredQuantity,
    };

    const response = plainToInstance(ReportJobResponseDto, dataReturn, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(response)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  private calculateJobQuantity(
    jobByUser: any,
    teamByUser: any,
    jobByTeam: any,
    userId: number,
  ): any {
    // Số công việc đã hoàn thành
    const successQuantity = plus(
      jobByUser.get(userId)?.completedQuantity || 0,
      jobByTeam.get(teamByUser.get(userId))?.completedQuantity || 0,
    );
    // Số công việc đang thực hiện
    const executeQuantity = plus(
      jobByUser.get(userId)?.inProgressQuantity || 0,
      jobByTeam.get(teamByUser.get(userId))?.inProgressQuantity || 0,
    );
    // Số công việc quá hạn
    const lateQuantity = plus(
      jobByUser.get(userId)?.lateQuantity || 0,
      jobByTeam.get(teamByUser.get(userId))?.lateQuantity || 0,
    );
    // Số công việc chờ xác nhận
    const waitQuantity = plus(
      jobByUser.get(userId)?.waitQuantity || 0,
      jobByTeam.get(teamByUser.get(userId))?.waitQuantity || 0,
    );
    // Số công việc kế hoạch
    const planQuantity = plus(
      jobByUser.get(userId)?.planQuantity || 0,
      jobByTeam.get(teamByUser.get(userId))?.planQuantity || 0,
    );
    // Số công việc phát sinh
    const incurredQuantity = plus(
      jobByUser.get(userId)?.incurredQuantity || 0,
      jobByTeam.get(teamByUser.get(userId))?.incurredQuantity || 0,
    );
    // Số công việc được giao
    const totalQuantity = plus(
      jobByUser.get(userId)?.totalQuantity || 0,
      jobByTeam.get(teamByUser.get(userId))?.totalQuantity || 0,
    );

    return {
      successQuantity,
      executeQuantity,
      lateQuantity,
      waitQuantity,
      planQuantity,
      incurredQuantity,
      totalQuantity,
    };
  }

  async listJobByPlan(
    request: GetListJobByPlanIdRequestDto,
  ): Promise<ResponsePayload<any>> {
    const isDraft = request.filter?.find(
      (filter) => filter.column === 'isDraft',
    );

    const checkDraft = isDraft?.text === 'true' ? true : false;

    let result: any;
    if (checkDraft) result = await this.jobDraftRepository.list(request);
    else result = await this.jobRepository.listByPlanId(request);
    const dataReturn = plainToInstance(JobByPlanResponse, result.data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder<PagingResponse>({
      items: dataReturn,
      meta: { total: result?.count, page: request.page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async delete(id: string): Promise<ResponsePayload<any>> {
    const job = await this.jobRepository.findOneById(id);

    if (!job) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }

    if (!JOB_STATUS_CAN_DELETE.includes(job.status)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.JOB_STATUS_INVALID'),
      ).toResponse();
    }

    await this.jobRepository.softDelete(job.id);

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async deleteJobDraft(id: string): Promise<ResponsePayload<any>> {
    await this.jobDraftRepository.deleteManyByCondition({
      uuid: id,
    });

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }
}
