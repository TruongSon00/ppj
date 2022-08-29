import { DeviceAssignmentRepositoryInterface } from '@components/device-assignment/interface/device-assignment.repository.interface';
import { DeviceRepositoryInterface } from '@components/device/interface/device.repository.interface';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { PagingResponse } from '@utils/paging.response';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToInstance } from 'class-transformer';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ListReportDeviceStatusQuery } from './dto/query/list-report-device-status.query';
import { ListReportDeviceAssignStatusQuery } from './dto/query/list-report-device-assign-status.query';
import { ListReportDeviceAssignStatusResponse } from './dto/response/list-report-device-assign-status.response';
import { ListReportDeviceStatusResponse } from './dto/response/list-report-device-status.response';
import { ReportDeviceStatusServiceInterface } from './interface/report-device-status.service.interface';
import { UserService } from '@components/user/user.service';
import { isEmpty } from 'lodash';
import { dynamicSort, plus } from '@utils/common';
import { MaintainRequestRepositoryInterface } from '@components/maintain-request/interface/maintain-request.repository.interface';
import { JobRepositoryInterface } from '@components/job/interface/job.repository.interface';
import { WarningRepositoryInterface } from '@components/warning/interface/warning.repository.interface';
import { JOB_TYPE_ENUM } from '@components/job/job.constant';
import { ItemService } from '@components/item/item.service';

@Injectable()
export class ReportDeviceStatusService
  implements ReportDeviceStatusServiceInterface
{
  constructor(
    @Inject('DeviceRepositoryInterface')
    private readonly deviceRepository: DeviceRepositoryInterface,

    @Inject('DeviceAssignmentRepositoryInterface')
    private readonly deviceAssignmentRepository: DeviceAssignmentRepositoryInterface,

    @Inject('WarningRepositoryInterface')
    private readonly warningRepository: WarningRepositoryInterface,

    @Inject('MaintainRequestRepositoryInterface')
    private readonly maintainRequestRepository: MaintainRequestRepositoryInterface,

    @Inject('JobRepositoryInterface')
    private readonly jobRepository: JobRepositoryInterface,

    @Inject('UserServiceInterface')
    private readonly userService: UserService,

    @Inject('ItemServiceInterface')
    private readonly itemService: ItemService,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async getListReportDeviceStatus(
    request: ListReportDeviceStatusQuery,
  ): Promise<ResponsePayload<any>> {
    const { result, count } =
      await this.deviceRepository.getListReportDeviceStatus(request);

    for (let i = 0; i < result.length; i++) {
      const itemStock = await this.itemService.getItemQuantityInWarehouses(
        result[i].code,
      );
      result[i].unUseQuantity = itemStock?.quantity || 0;
    }

    const dataReturn = plainToInstance(ListReportDeviceStatusResponse, result, {
      excludeExtraneousValues: true,
    });

    dataReturn.forEach((e) => {
      e.totalQuantity =
        e.unUseQuantity +
        e.usingQuantity +
        e.returnedQuantity +
        e.maintainQuantity +
        e.scrapQuantity;
    });

    return new ResponseBuilder<PagingResponse>({
      items: dataReturn,
      meta: { total: count, page: request.page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async getListReportDeviceAssignStatus(
    request: ListReportDeviceAssignStatusQuery,
  ): Promise<ResponsePayload<any>> {
    const { result, count } =
      await this.deviceAssignmentRepository.getListReportDeviceAssignStatus(
        request,
      );
    const deviceAssignmentIds = result.map((e) => e._id) || [];
    const warnings = await this.warningRepository.findAllByCondition({
      deviceAssignmentId: {
        $in: deviceAssignmentIds,
      },
    });
    const warningIds = warnings.map((e) => e._id) || [];

    const maintainRequests =
      await this.maintainRequestRepository.findAllByCondition({
        deviceAssignmentId: {
          $in: deviceAssignmentIds,
        },
      });
    const maintainRequestsIds = maintainRequests.map((e) => e._id) || [];

    const assignWarningMap = new Map();
    const assignMaintainRequestMap = new Map();
    warnings.forEach((e) => {
      assignWarningMap.set(e._id.toString(), e.deviceAssignmentId.toString());
    });
    maintainRequests.forEach((e) => {
      assignMaintainRequestMap.set(
        e._id.toString(),
        e.deviceAssignmentId.toString(),
      );
    });

    // Get job maintenance
    const jobMaintenance = await this.jobRepository.findAllByCondition({
      type: JOB_TYPE_ENUM.PERIOD_MAINTAIN,
      jobTypeId: {
        $in: warningIds,
      },
    });

    // Get job maintain request
    const jobRequestMaintainRequest =
      await this.jobRepository.findAllByCondition({
        type: JOB_TYPE_ENUM.MAINTENANCE_REQUEST,
        jobTypeId: {
          $in: maintainRequestsIds,
        },
      });

    // Get job warning error
    const jobWarningError = await this.jobRepository.findAllByCondition({
      type: JOB_TYPE_ENUM.WARNING,
      jobTypeId: {
        $in: warningIds,
      },
    });

    const countMaintain = new Map();
    const countRequestMaintainRequest = new Map();
    const countWarningError = new Map();
    jobMaintenance.forEach((e) => {
      countMaintain.set(
        assignWarningMap.get(e.jobTypeId.toString()),
        plus(
          countMaintain.get(assignWarningMap.get(e.jobTypeId.toString())) || 0,
          1,
        ),
      );
    });
    jobRequestMaintainRequest.forEach((e) => {
      countRequestMaintainRequest.set(
        assignMaintainRequestMap.get(e.jobTypeId.toString()),
        plus(
          countRequestMaintainRequest.get(
            assignMaintainRequestMap.get(e.jobTypeId.toString()),
          ) || 0,
          1,
        ),
      );
    });
    jobWarningError.forEach((e) => {
      countWarningError.set(
        assignWarningMap.get(e.jobTypeId.toString()),
        plus(
          countWarningError.get(assignWarningMap.get(e.jobTypeId.toString())) ||
            0,
          1,
        ),
      );
    });

    let userIds = result.map((e) => e.userId) || [];
    userIds = userIds
      .filter((e, i) => userIds.indexOf(e) === i)
      .filter((e) => e !== undefined);

    const users = await this.userService.getListByIDs(userIds);

    const userMap = new Map();
    users.forEach((e) => {
      userMap.set(e.id, e);
    });

    result.forEach((e) => {
      e.fullName = userMap.get(e.userId)?.fullName;
      e.username = userMap.get(e.userId)?.username;
      e.numOfMaintain = countMaintain.get(e._id.toString()) || 0;
      e.numOfError = plus(
        countRequestMaintainRequest.get(e._id.toString()) || 0,
        countWarningError.get(e._id.toString()) || 0,
      );
    });

    let dataReturn = plainToInstance(
      ListReportDeviceAssignStatusResponse,
      result,
      {
        excludeExtraneousValues: true,
      },
    );

    if (!isEmpty(request.sort)) {
      request.sort.forEach((item) => {
        switch (item.column) {
          case 'fullName':
            const order = item.order === 'desc' ? 'fullName' : '-fullName';
            dataReturn = dataReturn.sort(dynamicSort(order));
            break;
          default:
            break;
        }
      });
    }

    return new ResponseBuilder<PagingResponse>({
      items: dataReturn,
      meta: { total: count, page: request.page },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }
}
