import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { WarningRepositoryInterface } from './interface/warning.repository.interface';
import { CreateWarningDto } from './dto/request/create-warning.dto';
import { CreateWarningDataResponseDto } from './dto/response/create-warning-data.response.dto';
import { UserService } from '@components/user/user.service';
import { DetailWarningDataResponseDto } from './dto/response/detail-warning-data.response.dto';
import { plainToInstance } from 'class-transformer';
import { DetailWarningResponse } from './dto/response/detail-warning.response.dto';
import { GetListWarningRequestDto } from './dto/request/list-warning.request.dto';
import { ListWarningResponseDto } from './dto/response/list-warning.response.dto';
import { PagingResponse } from '@utils/paging.response';
import { first, isEmpty } from 'lodash';
import { WarningServiceInterface } from './interface/warning.service.interface';
import { RejectWarningRequestDto } from './dto/request/reject-warning.request.dto';
import { ApiError } from '@utils/api.error';
import {
  STATUS_TO_REJECT_WARNING,
  WARNING_STATUS_ENUM,
  WARNING_TYPE_ENUM,
} from './warning.constant';
import {
  JOB_TYPE_ENUM,
  STATUS_TO_APPROVE_WARNING,
} from '@components/job/job.constant';
import { ApproveWarningRequestDto } from '@components/job/dto/request/approve-warning.request.dto';
import { HISTORY_ACTION } from '@constant/common';
import { JobRepositoryInterface } from '@components/job/interface/job.repository.interface';
import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as moment from 'moment';
import { DeviceAssignmentRepositoryInterface } from '@components/device-assignment/interface/device-assignment.repository.interface';
import { DefectRepositoryInterface } from '@components/defect/interface/defect.repository.interface';
import { ProduceService } from '@components/produce/produce.service';

@Injectable()
export class WarningService implements WarningServiceInterface {
  constructor(
    @Inject('WarningRepositoryInterface')
    private readonly warningRepository: WarningRepositoryInterface,

    @Inject('DefectRepositoryInterface')
    private readonly defectRepository: DefectRepositoryInterface,

    @Inject('DeviceAssignmentRepositoryInterface')
    private readonly deviceAssignmentRepository: DeviceAssignmentRepositoryInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserService,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceService,

    @Inject('JobRepositoryInterface')
    private readonly jobRepository: JobRepositoryInterface,

    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly i18n: I18nRequestScopeService,
  ) {}

  async createWarning(
    data: CreateWarningDto,
  ): Promise<ResponsePayload<CreateWarningDataResponseDto | any>> {
    try {
      const { defectId, deviceAssignmentId } = data;
      const [defect, deviceAssignments] = await Promise.all([
        this.defectRepository.detail(defectId),
        this.deviceAssignmentRepository.detailDeviceAssignment(
          deviceAssignmentId,
        ),
      ]);
      const deviceAssignment: any = first(deviceAssignments);
      if (!defect) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(await this.i18n.translate('error.DEFECT_NOT_FOUND'))
          .build();
      }
      if (!deviceAssignment) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(
            await this.i18n.translate('error.DEVICE_ASSIGNMENT_NOT_FOUND'),
          )
          .build();
      }
      const warningEnt: any = { ...data };
      const userName = await this.i18n.translate('text.SYSTEM');
      const content = await this.i18n.translate(
        'text.MAINTAINANCE_DEVICE_ERROR_WARNING',
      );
      warningEnt.name = defect.name;
      warningEnt.priority = defect.priority;
      warningEnt.description = defect?.description;
      warningEnt.histories = [
        {
          content: content.replace(
            ':deviceName',
            deviceAssignment?.device[0]?.name || '',
          ),
          userName: userName,
          createdAt: new Date(),
          action: HISTORY_ACTION.CREATED,
        },
      ];
      const completeExpectedDate = deviceAssignment.mttrIndex
        ? moment()
            .add(+deviceAssignment.mttrIndex, 'minutes')
            .add(+deviceAssignment.mttaIndex, 'minutes')
        : moment()
            .add(+deviceAssignment.information?.mttrIndex, 'minutes')
            .add(+deviceAssignment.information?.mttaIndex, 'minutes');
      warningEnt.completeExpectedDate = completeExpectedDate;
      const warning = await this.warningRepository.createWarning(warningEnt);
      return new ResponseBuilder(warning)
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

  async detailWarning(
    request: any,
  ): Promise<ResponsePayload<DetailWarningDataResponseDto | any>> {
    try {
      const { id } = request;
      const warning = await this.warningRepository.findOneWithRelations(id);
      if (isEmpty(warning) || isEmpty(warning[0]?.deviceAssignment)) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.WARNING_NOT_FOUND'))
          .build();
      }
      const factoryId = warning[0].deviceAssignment[0]?.factoryId;
      const workCenterId = warning[0].deviceAssignment[0]?.workCenterId;
      const userId = warning[0].deviceAssignment[0]?.userId;
      const detailUser = await this.userService.detailUser(userId);
      if (detailUser.statusCode === ResponseCodeEnum.BAD_REQUEST) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }
      const factory = await this.userService.getFactoryById(factoryId);
      const workCenter = await this.produceService.getDetailWorkCenter(
        workCenterId,
      );

      const detailCompany = factory
        ? await this.userService.detailCompany(factory.companyId)
        : null;

      const [hanldeUser, responseWarning] = await Promise.all([
        this.hanldeUser(detailUser.data),
        this.hanldeWarning(warning),
      ]);
      responseWarning.user = hanldeUser;
      responseWarning.factory = factory;
      responseWarning.workCenter = workCenter;
      responseWarning.company = detailCompany?.data ?? null;
      const response = plainToInstance(DetailWarningResponse, responseWarning, {
        excludeExtraneousValues: true,
      });
      return new ResponseBuilder(response)
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

  async hanldeUser(data) {
    try {
      const hanldeUser = {
        id: data.id,
        email: data.email,
        username: data.username,
        fullName: data.fullName,
        companyId: data.companyId,
        code: data.code,
        phone: data.phone,
      };
      return hanldeUser;
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    }
  }

  async hanldeWarning(data) {
    try {
      let responsibleUser = null;
      if (data[0]?.deviceAssignment[0]?.responsibleUserId) {
        responsibleUser = await this.userService.detailUser(
          data[0]?.deviceAssignment[0]?.responsibleUserId,
        );
      }
      const warnings = data.map((warning) => ({
        ...warning,
        ...{
          deviceAssignment: warning.deviceAssignment.map((assign) => ({
            ...assign,
            ...{ responsibleUser: responsibleUser?.data },
          })),
        },
      }));

      return warnings[0];
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(error?.message || error)
        .build();
    }
  }

  async getListWarning(payload: GetListWarningRequestDto): Promise<any> {
    const { pageIndex, total, data } =
      await this.warningRepository.getListWarning(payload);
    const dataReturn = plainToInstance(ListWarningResponseDto, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder<PagingResponse>({
      items: !isEmpty(dataReturn) ? dataReturn : [],
      meta: { total: total, page: pageIndex },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async warningReject(request: RejectWarningRequestDto): Promise<any> {
    const warning = await this.warningRepository.findOneById(request.id);
    if (!warning) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }
    if (!STATUS_TO_REJECT_WARNING.includes(Number(warning.status)))
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.STATUS_WARNING_INVALID'),
      ).toResponse();
    try {
      await this.warningRepository.findByIdAndUpdate(request.id, {
        status: WARNING_STATUS_ENUM.REJECTED,
        reason: request.reason,
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

  async warningApprove(request: ApproveWarningRequestDto): Promise<any> {
    const warning = await this.warningRepository.findOneById(request.id);
    if (!warning) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }
    if (!STATUS_TO_APPROVE_WARNING.includes(warning.status))
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.STATUS_INVALID'),
      ).toResponse();
    const detailUser = await this.userService.detailUser(request.userId);
    if (detailUser.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.warningRepository.findByIdAndUpdate(request.id, {
        status: WARNING_STATUS_ENUM.CONFIRMED,
      });
      let data: any = {
        priority: warning.priority,
        deviceAssignmentId: warning.deviceAssignmentId,
        histories: [
          {
            userId: request.userId,
            content: `${detailUser.data.username} đã tạo công việc`,
            createdAt: new Date(),
            action: HISTORY_ACTION.CREATED,
          },
        ],
      };
      switch (warning.type) {
        case WARNING_TYPE_ENUM.PERIOD_MANTANCE:
          data = {
            ...data,
            jobTypeId: request.id,
            type: JOB_TYPE_ENUM.PERIOD_MAINTAIN,
          };
          break;
        case WARNING_TYPE_ENUM.CHECKLIST_TEMPLATE:
          data = {
            ...data,
            jobTypeId: request.id,
            type: JOB_TYPE_ENUM.PERIOD_CHECKLIST,
          };
          break;
        default:
          data = {
            ...data,
            jobTypeId: request.id,
            type: JOB_TYPE_ENUM.WARNING,
          };
      }

      const dataReturn = await this.jobRepository.createJobEntity(data);
      await session.commitTransaction(dataReturn);
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
}
