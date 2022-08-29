import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { DashboardServiceInterface } from './interface/dashboard.service.interface';
import { JobRepositoryInterface } from '../job/interface/job.repository.interface';
import { plainToInstance } from 'class-transformer';
import { DashboardSummaryResponseDto } from './dto/response/summary.response.dto';
import { DashboardDeviceAssignmentRequestDto } from './dto/request/dashboard-device-assignment.request.dto';
import { DeviceAssignmentRepositoryInterface } from '../device-assignment/interface/device-assignment.repository.interface';
import { DashboardDeviceAssignmentStatusDataResponseDto } from './dto/response/device-assignment-status.response.dto';
import { DashboardWarningRequestDto } from './dto/request/dashboard-warning.request.dto';
import { UserInforRequestDto } from '@components/user/dto/request/user-info.request.dto';
import { DEPARTMENT_PERMISSION_SETTING_CAN_SEE } from '@utils/permissions/department-permission-setting';
import { WarningRepository } from 'src/repository/warning/warning.repository';
import { ProduceService } from '@components/produce/produce.service';
import * as moment from 'moment';
import { ReportType } from '@constant/common';
import { ApiError } from '@utils/api.error';
import {
  RangeDate,
  ReportStockByDay,
} from '@components/report/dto/response/report-by-type.response';
import { DefectPriorityConstant } from '@components/defect/defect.constant';
import { div, dynamicSort, mapStatusDeviceStatus, plus } from '@utils/common';
import { ResponsePayload } from '@utils/response-payload';
import { GetDashboardDeviceStatusRequestDto } from './dto/request/dashboard-device-status.request.dto';
import { DeviceStatusRepository } from 'src/repository/device-status/device-status.repository';
import { DashboardDeviceStatusResponseDto } from './dto/response/dashboard-device-status.response.dto';
import { PaginationQuery } from '@utils/pagination.query';
import { WorkTimeDataSourceEnum } from '@components/device-assignment/device-assignment.constant';
import { isEmpty, isUndefined } from 'lodash';
import { DEVICE_STATUS_ENUM } from '@components/device-status/device-status.constant';
import { MaintainRequestRepositoryInterface } from '@components/maintain-request/interface/maintain-request.repository.interface';

@Injectable()
export class DashboardService implements DashboardServiceInterface {
  constructor(
    @Inject('JobRepositoryInterface')
    private readonly jobRepository: JobRepositoryInterface,

    @Inject('DeviceAssignmentRepositoryInterface')
    private readonly deviceAssignmentRepository: DeviceAssignmentRepositoryInterface,

    @Inject('WarningRepositoryInterface')
    private readonly warningRepository: WarningRepository,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceService,

    @Inject('DeviceStatusRepositoryInterface')
    private readonly deviceStatusRepository: DeviceStatusRepository,

    @Inject('MaintainRequestRepositoryInterface')
    private readonly maintainRequestRepository: MaintainRequestRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  private checkRuleItOrAdmin(user: UserInforRequestDto): boolean {
    let checkPermission = false;
    user.departmentSettings.forEach((department) => {
      if (DEPARTMENT_PERMISSION_SETTING_CAN_SEE.includes(department.id)) {
        checkPermission = true;
      }
    });

    return checkPermission;
  }

  async dashboardSummary() {
    try {
      const dashboardSummary = await this.jobRepository.dashboardSummary();
      const dataReturn = plainToInstance(
        DashboardSummaryResponseDto,
        dashboardSummary,
        {
          excludeExtraneousValues: true,
        },
      );
      return new ResponseBuilder(dataReturn)
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

  async dashboardDeviceAssignment(
    request: DashboardDeviceAssignmentRequestDto,
  ) {
    try {
      const dashboardSummary =
        await this.deviceAssignmentRepository.dashboardDeviceAssignment(
          request,
        );
      const dataReturn = plainToInstance(
        DashboardDeviceAssignmentStatusDataResponseDto,
        dashboardSummary,
        {
          excludeExtraneousValues: true,
        },
      );
      return new ResponseBuilder(dataReturn)
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

  async dashboardWarning(request: DashboardWarningRequestDto) {
    try {
      if (
        request.startDate &&
        request.endDate &&
        moment(request.startDate) >= moment(request.endDate)
      ) {
        return new ApiError(
          ResponseCodeEnum.BAD_REQUEST,
          await this.i18n.translate('error.INVALID_DATE_RANGE'),
        ).toResponse();
      }

      const { listRangeDate, startDate, endDate } = this.getRangeDateByDateType(
        request.reportType,
        request.startDate,
        request.endDate,
      );

      const dashboardWarning = await this.warningRepository.dashboardWarning(
        startDate,
        endDate,
      );

      const dashboardMaintainRequest =
        await this.maintainRequestRepository.dashboardMaintainRequest(
          startDate,
          endDate,
        );

      const reportData: ReportStockByDay[] = [];

      listRangeDate.forEach((rangeDate) => {
        const rangeDateStock = [
          ...dashboardWarning,
          ...dashboardMaintainRequest,
        ].filter(
          (e) =>
            Number(moment(e.date).format('YYYYMMDD')) >=
              Number(rangeDate.startDate) &&
            Number(moment(e.date).format('YYYYMMDD')) <=
              Number(rangeDate.endDate),
        );
        const statusCountMap = new Map();
        for (let i = 1; i <= 5; i++) {
          statusCountMap.set(i, 0);
        }
        rangeDateStock.forEach((e) => {
          switch (e?._id?.status) {
            case DefectPriorityConstant.BLOCKER:
              statusCountMap.set(
                DefectPriorityConstant.BLOCKER,
                plus(
                  statusCountMap.get(DefectPriorityConstant.BLOCKER) || 0,
                  e?.count || 0,
                ),
              );
              break;
            case DefectPriorityConstant.CRITICAL:
              statusCountMap.set(
                DefectPriorityConstant.CRITICAL,
                plus(
                  statusCountMap.get(DefectPriorityConstant.CRITICAL) || 0,
                  e?.count || 0,
                ),
              );
              break;
            case DefectPriorityConstant.MAJOR:
              statusCountMap.set(
                DefectPriorityConstant.MAJOR,
                plus(
                  statusCountMap.get(DefectPriorityConstant.MAJOR) || 0,
                  e?.count || 0,
                ),
              );
              break;
            case DefectPriorityConstant.MINOR:
              statusCountMap.set(
                DefectPriorityConstant.MINOR,
                plus(
                  statusCountMap.get(DefectPriorityConstant.MINOR) || 0,
                  e?.count || 0,
                ),
              );
              break;
            case DefectPriorityConstant.TRIVIAL:
              statusCountMap.set(
                DefectPriorityConstant.TRIVIAL,
                plus(
                  statusCountMap.get(DefectPriorityConstant.TRIVIAL) || 0,
                  e?.count || 0,
                ),
              );
              break;
            default:
              break;
          }
        });

        const countReport = [];
        statusCountMap.forEach((value, key) => {
          countReport.push({
            priority: key,
            count: value,
          });
        });
        countReport.sort((a, b) => Number(a.priority) - Number(b.priority));

        reportData.push(
          new ReportStockByDay(
            request.reportType,
            rangeDate.tag,
            countReport,
            this.getRangeDate(
              rangeDate.startDate,
              rangeDate.endDate,
              request.reportType,
            ),
          ),
        );
      });
      return new ResponseBuilder(reportData)
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

  private getRangeDate(
    startDate: string,
    endDate: string,
    reportType: number,
  ): string {
    switch (reportType) {
      case ReportType.WEEK:
        return moment(startDate, 'YYYYMMDD').format('DD/MM/YYYY');
      default:
        return `${moment(startDate, 'YYYYMMDD').format('DD/MM')}-${moment(
          endDate,
          'YYYYMMDD',
        ).format('DD/MM')}`;
    }
  }

  private getRangeDateByDateType(
    reportType: number,
    startDate?: Date,
    endDate?: Date,
  ): {
    listRangeDate: RangeDate[];
    startDate: Date;
    endDate: Date;
  } {
    const listRangeDate: RangeDate[] = [];
    let unit: 'day' | 'week' | 'month' = 'day';
    switch (reportType) {
      case ReportType.MONTH:
        unit = 'week';
        break;
      case ReportType.QUARTER:
        unit = 'month';
        break;
      default:
        break;
    }
    const from = startDate
      ? moment(startDate)
      : reportType === ReportType.MONTH
      ? moment().month(moment().month()).startOf('month')
      : reportType === ReportType.QUARTER
      ? moment().quarter(moment().quarter()).startOf('quarter')
      : moment().isoWeek(moment().isoWeek()).startOf('isoWeek');

    const to = endDate
      ? moment(endDate)
      : reportType === ReportType.MONTH
      ? moment().month(moment().month()).endOf('month')
      : reportType === ReportType.QUARTER
      ? moment().quarter(moment().quarter()).endOf('quarter')
      : moment().isoWeek(moment().isoWeek()).endOf('isoWeek');
    let tag = 1;
    for (
      let date = from.clone();
      date.isSameOrBefore(to, 'day');
      date = date.clone().add(1, unit)
    ) {
      const endOfMonth = date.clone().endOf('month').format('YYYYMMDD');
      const endDate = date
        .clone()
        .add(1, unit)
        .subtract(1, 'day')
        .format('YYYYMMDD');
      listRangeDate.push(
        new RangeDate(
          reportType,
          `${tag}`,
          date.clone().format('YYYYMMDD'),
          endOfMonth < endDate ? endOfMonth : endDate,
        ),
      );
      tag++;
    }
    return { listRangeDate, startDate: from.toDate(), endDate: to.toDate() };
  }

  async dashboardDeviceStatus(
    request: GetDashboardDeviceStatusRequestDto,
  ): Promise<ResponsePayload<any>> {
    try {
      let totalInActive = 0,
        totalInStop = 0,
        totalInError = 0,
        totalInMaintain = 0,
        totalInShutDown = 0,
        totalInUse = 0;

      const data = await this.deviceAssignmentRepository.dashboardDevicestatus(
        request,
      );

      const dates = [];
      let oeeTotal = 0;

      for (let i = 0; i < data.length; i++) {
        const { deviceStatuses } = data[i];

        let totalActualQuantity = 0;
        let totalPassQuantity = 0;
        let actualTime = 0;
        let restTime = 0;
        const moIds = deviceStatuses
          .map((e) => {
            if (
              moment(deviceStatuses[0].endDate).isSameOrBefore(e.endDate, 'day')
            ) {
              return e.moId;
            }
            return null;
          })
          .filter((e) => e !== null);

        const response = await this.produceService.getInfoOeeByMo(
          moIds.join(','),
          data[i]?.workCenterId || 0,
        );

        const workTimeDataSource = data[i].workTimeDataSource;

        const listStatus = [];
        const listDateRange = [];
        if (deviceStatuses.length) {
          for (let index = 0; index < deviceStatuses.length; index++) {
            totalInActive += deviceStatuses[index].numOfActive;
            totalInStop += deviceStatuses[index].numOfStop;
            totalInError += deviceStatuses[index].numOfError;
            totalInShutDown += deviceStatuses[index].numOfOff;
            totalInMaintain += deviceStatuses[index].numOfMaintain;
            totalInUse += deviceStatuses[index].numOfUse;
            totalActualQuantity += deviceStatuses[index].actualQuantity;
            totalPassQuantity += deviceStatuses[index].passQuantity;
            actualTime += deviceStatuses[index].timeAction;
            restTime += deviceStatuses[index].timeRest;

            listStatus.push(...deviceStatuses[index].listStatus);
            listDateRange.push(...deviceStatuses[index].dateRange);
            dates.push(deviceStatuses[index].date);
          }
        }

        if (workTimeDataSource !== WorkTimeDataSourceEnum.INPUT)
          oeeTotal +=
            response.totalActualQuantity === 0 ||
            isUndefined(response.totalActualQuantity)
              ? 0
              : div(
                  response.totalActualExecutionTime,
                  response.totalPlanExecutionTime || 1,
                ) *
                div(
                  response.totalQcPassQuantity,
                  response.totalActualQuantity,
                ) *
                div(
                  response.productivityRatio,
                  div(response.totalQcPassQuantity, data[i].timeAction || 1) ||
                    1,
                ) *
                100;
        else {
          const planTime = plus(actualTime, restTime);
          oeeTotal +=
            totalActualQuantity === 0 || isUndefined(totalActualQuantity)
              ? 0
              : div(actualTime, planTime || 1) *
                div(totalPassQuantity, totalActualQuantity) *
                div(
                  data[i]?.productivityTarget || 1,
                  div(totalActualQuantity, actualTime || 1) || 1,
                ) *
                100;
        }

        const maxDateRange = listDateRange.sort(dynamicSort('-endDate'))[0];
        const maxStatus = listStatus.sort(dynamicSort('-endDate'))[0];
        data[i].status = mapStatusDeviceStatus(
          data[i].workTimeDataSource,
          maxStatus?.status,
          data[i].status,
        );

        if (isUndefined(maxStatus?.status)) {
          switch (data[i].status) {
            case DEVICE_STATUS_ENUM.ACTIVE:
              totalInActive++;
              break;
            case DEVICE_STATUS_ENUM.IN_USE:
              totalInUse++;
              break;
            case DEVICE_STATUS_ENUM.MAINTENANCE:
              totalInMaintain++;
              break;
            case DEVICE_STATUS_ENUM.ERROR:
              totalInError++;
            case DEVICE_STATUS_ENUM.OFF:
              totalInShutDown++;
              break;
            case DEVICE_STATUS_ENUM.STOP:
              totalInStop++;
              break;
            default:
              break;
          }
        }

        if (
          !isEmpty(maxDateRange) &&
          data[i].status === DEVICE_STATUS_ENUM.ACTIVE
        ) {
          let duration;
          const inDay = moment(maxDateRange.startDate).isSame(
            maxDateRange.endDate,
            'day',
          );

          if (!inDay) {
            duration = moment.duration(
              moment(maxDateRange.endDate).diff(
                moment(maxDateRange.endDate).startOf('day').toISOString(),
                'minute',
              ),
              'minute',
            );
          } else {
            duration = moment.duration(
              moment(maxDateRange.endDate).diff(maxDateRange.startDate),
              'minute',
            );
          }

          data[i].activeTime = `${duration.hours()}:${duration.minutes()}`;
        } else {
          data[i].activeTime = '';
        }
      }

      let moList = [];

      if (request.factoryId) {
        const params = {
          filter: [
            { column: 'factoryIds', text: request.factoryId?.toString() },
          ],
        } as PaginationQuery;
        moList = await this.produceService.getMoList(params);
      }

      const totalDeviceStatus = {
        totalInActive,
        totalInStop,
        totalInError,
        totalInMaintain,
        totalInShutDown,
        totalInUse,
      };

      const moListRes = (moList || []).map((item) => ({
        id: item.id,
        name: item.name,
      }));

      if (!dates.length) {
        dates.push(new Date());
      }
      const dataReturn = {
        exportedAt: moment(Math.max(...dates)).toDate(),
        deviceStatusData: data,
        totalDeviceStatus,
        deviceTotal: data.length,
        oee: Math.round(div(oeeTotal, data.length || 1)),
        moList: moListRes,
      };

      const finalRes = plainToInstance(
        DashboardDeviceStatusResponseDto,
        dataReturn,
        {
          excludeExtraneousValues: true,
        },
      );

      return new ResponseBuilder(finalRes)
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
}
