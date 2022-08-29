import { ReportTotalJobResponse } from '@components/job/dto/response/report-total-job.response.dto';
import { JobRepositoryInterface } from '@components/job/interface/job.repository.interface';
import {
  INDEX_ENUM,
  JOB_STATUS_ENUM,
  JOB_STATUS_RESPONSE_ENUM,
  LIST_JOB_STATUS_RESPONSE,
  STATUS_JOB_PROGRESS_ENUM,
  STATUS_MAINTAIN_REQUEST_ENUM,
} from '@components/job/job.constant';
import { MaintainRequestRepositoryInterface } from '@components/maintain-request/interface/maintain-request.repository.interface';
import { MAINTAIN_REQUEST_STATUS_ENUM } from '@components/maintain-request/maintain-request.constant';
import { ReportType } from '@constant/common';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ApiError } from '@utils/api.error';
import { div, plus } from '@utils/common';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponsePayload } from '@utils/response-payload';
import { plainToInstance } from 'class-transformer';
import * as moment from 'moment';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportProgressJobQuery } from './dto/query/report-progress-job.query';
import {
  CountReport,
  RangeDate,
  ReportStockByDay,
} from './dto/response/report-by-type.response';
import { ReportServiceInterface } from './interface/report.service.interface';
import { dynamicSort } from '@utils/common';
import { DashboardMttrMttaIndexQuery } from './dto/query/dashboard-mttr-mtta-index.query';
import { MaintenanceTeamRepositoryInterface } from '@components/maintenance-team/interface/maintenance-team.repository.interface';

@Injectable()
export class ReportService implements ReportServiceInterface {
  constructor(
    @Inject('JobRepositoryInterface')
    private readonly jobRepository: JobRepositoryInterface,

    @Inject('MaintainRequestRepositoryInterface')
    private readonly maintainRequestRepository: MaintainRequestRepositoryInterface,

    @Inject('MaintenanceTeamRepositoryInterface')
    private readonly maintenanceTeamRepository: MaintenanceTeamRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async reportTotalJob(): Promise<ResponsePayload<any>> {
    const [result, resultJobNotComplete, resultJobComplete]: any =
      await Promise.all([
        this.jobRepository.reportTotalJob(),
        this.jobRepository.reportNotCompleteJob(),
        this.jobRepository.reportCompleteJob(),
      ]);

    const reportMap = new Map();
    result.forEach((e) => {
      switch (e?._id?.status) {
        case JOB_STATUS_ENUM.LATE:
        case JOB_STATUS_ENUM.OUT_OF_DATE:
          reportMap.set(
            JOB_STATUS_RESPONSE_ENUM.LATE,
            plus(reportMap.get(JOB_STATUS_RESPONSE_ENUM.LATE) || 0, e.count),
          );
          break;
        default:
          break;
      }
    });

    resultJobNotComplete.forEach((e) => {
      switch (e?._id?.status) {
        case JOB_STATUS_ENUM.TO_DO:
        case JOB_STATUS_ENUM.IN_PROGRESS:
        case JOB_STATUS_ENUM.COMPLETED:
          reportMap.set(
            JOB_STATUS_RESPONSE_ENUM.NOT_COMPLETED,
            plus(
              reportMap.get(JOB_STATUS_RESPONSE_ENUM.NOT_COMPLETED) || 0,
              e.count,
            ),
          );
          break;
        default:
          break;
      }
    });

    resultJobComplete.forEach((e) => {
      reportMap.set(
        JOB_STATUS_RESPONSE_ENUM.COMPLETED,
        plus(reportMap.get(JOB_STATUS_RESPONSE_ENUM.COMPLETED) || 0, e.count),
      );
    });

    reportMap.set(
      JOB_STATUS_RESPONSE_ENUM.ALL,
      plus(
        plus(
          reportMap.get(JOB_STATUS_RESPONSE_ENUM.COMPLETED) || 0,
          reportMap.get(JOB_STATUS_RESPONSE_ENUM.NOT_COMPLETED) || 0,
        ),
        reportMap.get(JOB_STATUS_RESPONSE_ENUM.LATE) || 0,
      ),
    );

    const data = LIST_JOB_STATUS_RESPONSE.map((e) => ({
      status: e,
      count: reportMap.get(e) || 0,
    }));

    const dataReturn = plainToInstance(ReportTotalJobResponse, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async reportProgressJob(
    request: ReportProgressJobQuery,
  ): Promise<ResponsePayload<any>> {
    const checkDate = this.compareDate(request.startDate, request.endDate);
    if (!checkDate) {
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

    let result = await this.jobRepository.reportProgressJob(startDate, endDate);

    result = this.getRangeDateHistory(result);

    const dataHistories = result.map((e) => e.histories).flat();

    const reportData: ReportStockByDay[] = [];

    listRangeDate.forEach((rangeDate) => {
      const rangeDateStock = dataHistories.filter(
        (e) =>
          Number(moment(e.createdAt).format('YYYYMMDD')) >=
            Number(rangeDate.startDate) &&
          Number(moment(e.createdAt).format('YYYYMMDD')) <=
            Number(rangeDate.endDate),
      );

      const statusCountMap = new Map();
      statusCountMap.set(STATUS_JOB_PROGRESS_ENUM.WAITING_CONFIRM, 0);
      statusCountMap.set(STATUS_JOB_PROGRESS_ENUM.IN_PROGRESS, 0);
      statusCountMap.set(STATUS_JOB_PROGRESS_ENUM.COMPLETED, 0);
      statusCountMap.set(STATUS_JOB_PROGRESS_ENUM.LATE, 0);
      rangeDateStock.forEach((e) => {
        switch (e?.status) {
          case JOB_STATUS_ENUM.NON_ASSIGN:
          case JOB_STATUS_ENUM.WAITING_TO_CONFIRMED:
            statusCountMap.set(
              STATUS_JOB_PROGRESS_ENUM.WAITING_CONFIRM,
              plus(
                statusCountMap.get(STATUS_JOB_PROGRESS_ENUM.WAITING_CONFIRM) ||
                  0,
                1,
              ),
            );
            break;
          case JOB_STATUS_ENUM.TO_DO:
          case JOB_STATUS_ENUM.IN_PROGRESS:
          case JOB_STATUS_ENUM.COMPLETED:
            statusCountMap.set(
              STATUS_JOB_PROGRESS_ENUM.IN_PROGRESS,
              plus(
                statusCountMap.get(STATUS_JOB_PROGRESS_ENUM.IN_PROGRESS) || 0,
                1,
              ),
            );
            break;
          case JOB_STATUS_ENUM.RESOLVED:
            statusCountMap.set(
              STATUS_JOB_PROGRESS_ENUM.COMPLETED,
              plus(
                statusCountMap.get(STATUS_JOB_PROGRESS_ENUM.COMPLETED) || 0,
                1,
              ),
            );
            break;
          case JOB_STATUS_ENUM.LATE:
          case JOB_STATUS_ENUM.OUT_OF_DATE:
            statusCountMap.set(
              STATUS_JOB_PROGRESS_ENUM.LATE,
              plus(statusCountMap.get(STATUS_JOB_PROGRESS_ENUM.LATE) || 0, 1),
            );
            break;

          default:
            break;
        }
      });

      const countReport: CountReport[] = [];
      statusCountMap.forEach((value, key) => {
        countReport.push({
          status: key,
          count: value,
        });
      });

      reportData.push(
        new ReportStockByDay(
          request.reportType,
          rangeDate.tag,
          countReport.sort(dynamicSort('status')),
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
  }

  async reportMaintainRequest(
    request: ReportProgressJobQuery,
  ): Promise<ResponsePayload<any>> {
    const checkDate = this.compareDate(request.startDate, request.endDate);
    if (!checkDate) {
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

    let result = await this.maintainRequestRepository.reportMaintainRequest(
      startDate,
      endDate,
    );
    result = this.getRangeDateHistory(result);
    const dataHistories = result.map((e) => e.histories).flat();

    const reportData: ReportStockByDay[] = [];

    listRangeDate.forEach((rangeDate) => {
      const rangeDateStock = dataHistories.filter(
        (e) =>
          Number(moment(e.createdAt).format('YYYYMMDD')) >=
            Number(rangeDate.startDate) &&
          Number(moment(e.createdAt).format('YYYYMMDD')) <=
            Number(rangeDate.endDate),
      );

      const statusCountMap = new Map();
      statusCountMap.set(STATUS_MAINTAIN_REQUEST_ENUM.WAITING_CONFIRM, 0);
      statusCountMap.set(STATUS_MAINTAIN_REQUEST_ENUM.IN_PROGRESS, 0);
      statusCountMap.set(STATUS_MAINTAIN_REQUEST_ENUM.COMPLETED, 0);
      rangeDateStock.forEach((e) => {
        switch (e?.status) {
          case MAINTAIN_REQUEST_STATUS_ENUM.CREATED:
          case MAINTAIN_REQUEST_STATUS_ENUM.CONFIRMED_1:
          case MAINTAIN_REQUEST_STATUS_ENUM.CONFIRMED_2:
            statusCountMap.set(
              STATUS_MAINTAIN_REQUEST_ENUM.WAITING_CONFIRM,
              plus(
                statusCountMap.get(
                  STATUS_MAINTAIN_REQUEST_ENUM.WAITING_CONFIRM,
                ) || 0,
                1,
              ),
            );
            break;
          case MAINTAIN_REQUEST_STATUS_ENUM.NOT_EXECUTED:
          case MAINTAIN_REQUEST_STATUS_ENUM.IN_PROGRESS:
            statusCountMap.set(
              STATUS_MAINTAIN_REQUEST_ENUM.IN_PROGRESS,
              plus(
                statusCountMap.get(STATUS_MAINTAIN_REQUEST_ENUM.IN_PROGRESS) ||
                  0,
                1,
              ),
            );
            break;
          case MAINTAIN_REQUEST_STATUS_ENUM.COMPLETED:
            statusCountMap.set(
              STATUS_MAINTAIN_REQUEST_ENUM.COMPLETED,
              plus(
                statusCountMap.get(STATUS_MAINTAIN_REQUEST_ENUM.COMPLETED) || 0,
                1,
              ),
            );
            break;

          default:
            break;
        }
      });

      const countReport: CountReport[] = [];
      statusCountMap.forEach((value, key) => {
        countReport.push({
          status: key,
          count: value,
        });
      });

      reportData.push(
        new ReportStockByDay(
          request.reportType,
          rangeDate.tag,
          countReport.sort(dynamicSort('status')),
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
  }

  async dashboardMttrMttaIndex(
    request: DashboardMttrMttaIndexQuery,
  ): Promise<ResponsePayload<any>> {
    const checkDate = this.compareDate(request.startDate, request.endDate);
    if (!checkDate) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        await this.i18n.translate('error.INVALID_DATE_RANGE'),
      ).toResponse();
    }

    let userIds = [];
    if (request.maintainTeam) {
      const maintainTeam = await this.maintenanceTeamRepository.findOneById(
        request.maintainTeam,
      );
      userIds = maintainTeam.members.map((member) => member.userId.toString());
    }

    const { listRangeDate, startDate, endDate } = this.getRangeDateByDateType(
      request.reportType,
      request.startDate,
      request.endDate,
    );

    const jobs = await this.jobRepository.getJobWithMttIndex(
      startDate,
      endDate,
      userIds,
      request.maintainTeam,
      request.factory,
    );

    const reportData: ReportStockByDay[] = [];

    listRangeDate.forEach((rangeDate) => {
      const rangeDateStock = jobs.filter((e) => {
        const job = e.histories.find((v) => {
          return (
            Number(moment(v.createdAt).format('YYYYMMDD')) >=
              Number(rangeDate.startDate) &&
            Number(moment(v.createdAt).format('YYYYMMDD')) <=
              Number(rangeDate.endDate)
          );
        });

        return job ? true : false;
      });

      const indexMap = new Map();
      indexMap.set(INDEX_ENUM.MTTA, 0);
      indexMap.set(INDEX_ENUM.MTTR, 0);
      let count = 0;
      rangeDateStock.forEach((e) => {
        const maintainRequestHistories =
          e.deviceAssignmentId?.maintainRequestHistories;
        if (maintainRequestHistories)
          maintainRequestHistories?.forEach((v) => {
            if (
              v.maintainRequestId.toString() === e.jobTypeId.toString() &&
              Number(moment(v.createdAt).format('YYYYMMDD')) >=
                Number(rangeDate.startDate) &&
              Number(moment(v.createdAt).format('YYYYMMDD')) <=
                Number(rangeDate.endDate)
            ) {
              indexMap.set(
                INDEX_ENUM.MTTA,
                plus(indexMap.get(INDEX_ENUM.MTTA), v?.mttaIndex || 0),
              );
              indexMap.set(
                INDEX_ENUM.MTTR,
                plus(indexMap.get(INDEX_ENUM.MTTR), v?.mttrIndex || 0),
              );
              count++;
            }
          });
      });

      if (count !== 0) {
        indexMap.set(
          INDEX_ENUM.MTTA,
          div(indexMap.get(INDEX_ENUM.MTTA), count),
        );
        indexMap.set(
          INDEX_ENUM.MTTR,
          div(indexMap.get(INDEX_ENUM.MTTR), count),
        );
      }

      const countReport: CountReport[] = [];
      indexMap.forEach((value, key) => {
        countReport.push({
          status: key,
          count: value,
        });
      });

      reportData.push(
        new ReportStockByDay(
          request.reportType,
          rangeDate.tag,
          countReport.sort(dynamicSort('status')),
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

  private compareDate(startDate: Date, endDate: Date): boolean {
    if (startDate && endDate)
      return (
        moment(startDate).startOf('day').toDate() <
        moment(endDate).endOf('day').toDate()
      );
    return true;
  }

  private getRangeDateHistory(result: any[]): any[] {
    return result.map((e) => {
      const tempHistories = [];
      for (let i = 0; i < e.histories.length; i++) {
        const history = e.histories[i];
        const nextHistory = e.histories[i + 1];
        const createdAt = history.createdAt;
        const nextCreatedAt = nextHistory?.createdAt;

        if (
          nextCreatedAt !== undefined &&
          moment(createdAt).startOf('day').toDate().toString() ===
            moment(nextCreatedAt).startOf('day').toDate().toString()
        )
          continue;

        tempHistories.push(history);

        let nextDate = moment(createdAt).add(1, 'days').toDate();

        while (nextDate < nextCreatedAt) {
          const cloneHistory = {
            ...history,
            createdAt: nextDate,
          };
          tempHistories.push(cloneHistory);
          nextDate = moment(nextDate).add(1, 'days').toDate();
        }
      }

      return {
        ...e,
        histories: tempHistories,
      };
    });
  }
}
