import { ApiError } from '@utils/api.error';
import { AttributeTypeRepositoryInterface } from '@components/attribute-type/interface/attribute-type.repository.interface';
import { GetLogTimeByMoId } from './../device-assignment/dto/request/get-log-time-by-mo-id.dto';
import { Inject, Injectable } from '@nestjs/common';
import { I18nRequestScopeService } from 'nestjs-i18n';
import * as moment from 'moment';
import { plainToInstance } from 'class-transformer';
import { DeviceStatusServiceInterface } from './interface/device-status.service.interface';
import { DeviceStatusRepositoryInterface } from './interface/device-status.repository.interface';
import { CreateDeviceStatusActivityRequestDto } from './dto/request/create-device-status-activity.request.dto';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponsePayload } from '@utils/response-payload';
import { ListDeviceStatusQuery } from './dto/query/list-device-status.query';
import { ListDeviceStatusResponse } from './dto/response/list-device-status.response';
import { div, dynamicSort, minus, mul, plus } from '@utils/common';
import { ProduceService } from '@components/produce/produce.service';
import { DEVICE_STATUS_ENUM } from './device-status.constant';
import { DeviceStatusActivityInfoRequestDto } from './dto/response/list-device-status-activity-info.response.dto';
import { DeviceAssignmentRepositoryInterface } from '@components/device-assignment/interface/device-assignment.repository.interface';
import { DeviceAssignmentServiceInterface } from '@components/device-assignment/interface/device-assignment.service.interface';
import { PaginationQuery } from '@utils/pagination.query';
import {
  DEVICE_ASIGNMENTS_STATUS_ENUM,
  WorkTimeDataSourceEnum,
} from '@components/device-assignment/device-assignment.constant';
import { first, groupBy, isEmpty, flatMap, isUndefined } from 'lodash';
import { ListDeviceStatusActivityInfoRequestDto } from './dto/request/list-device-status-activity-info.request.dto';
import { ListDeviceStatusBySerialRequestDto } from './dto/request/list-device-status-by-serial.request.dto';
import { UnitRepositoryInterface } from '@components/unit/interface/unit.repository.interface';

@Injectable()
export class DeviceStatusService implements DeviceStatusServiceInterface {
  constructor(
    @Inject('DeviceStatusRepositoryInterface')
    private readonly deviceStatusRepository: DeviceStatusRepositoryInterface,

    @Inject('ProduceServiceInterface')
    private readonly produceService: ProduceService,

    @Inject('DeviceAssignmentServiceInterface')
    private readonly deviceAssignmentService: DeviceAssignmentServiceInterface,

    @Inject('DeviceAssignmentRepositoryInterface')
    private readonly deviceAssignmentRepository: DeviceAssignmentRepositoryInterface,

    @Inject('AttributeTypeRepositoryInterface')
    private readonly attributeTypeRepository: AttributeTypeRepositoryInterface,

    @Inject('UnitRepositoryInterface')
    private readonly unitRepository: UnitRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async listActivityByMes(deviceAss, page, limit, startDate, endDate, sort) {
    const startDay = moment().subtract(365, 'days').format('YYYY-MM-DD');
    const endDay = moment().format('YYYY-MM-DD');
    const params = {
      filter: [
        { column: 'plan', text: `${startDay}|${endDay}` },
        { column: 'workCenterId', text: deviceAss[0].workCenterId },
      ],
    } as PaginationQuery;
    const moList = await this.produceService.getMoList(params);

    let dataPagination = [];
    let totalOee = 0;
    let rawData;
    let latestRecord;

    if (moList?.data?.length) {
      const moIds = moList?.data.map((val) => val.moId);
      rawData = await this.deviceAssignmentService.getLogTimeByMoId({
        wcId: deviceAss[0].workCenterId,
        moIds: moIds.toString(),
      } as GetLogTimeByMoId);
      if (!rawData?.data?.length) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.NOT_FOUND)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      }
      let timeAction = 0;
      let parseData = rawData.data.map((val) => {
        timeAction = timeAction + val.workTime;
        return {
          date: val.day,
          vacation: val.stopTime,
          active: val.workTime,
        };
      });
      const mo = await this.produceService.getInfoOeeByMo(
        moIds.toString(),
        deviceAss[0].workCenterId || 0,
      );
      if (mo) {
        totalOee =
          div(mo.totalActualExecutionTime, mo.totalPlanExecutionTime || 1) *
          div(mo.totalQcPassQuantity, mo.totalActualQuantity || 1) *
          div(
            mo.productivityRatio,
            div(mo.totalQcPassQuantity, timeAction || 1) || 1,
          );
      }

      if (startDate) {
        parseData = parseData.filter((e) =>
          moment(e.date).isSameOrAfter(startDate, 'day'),
        );
      }

      if (endDate) {
        parseData = parseData.filter((e) =>
          moment(e.date).isSameOrBefore(endDate, 'day'),
        );
      }

      if (!isEmpty(sort)) {
        sort.forEach((item) => {
          switch (item.column) {
            case 'date':
              const order =
                item.order.toLowerCase() === 'desc' ? 'date' : '-date';
              parseData = parseData.sort(dynamicSort(order));
              break;
            default:
              break;
          }
        });
      } else {
        parseData = parseData.sort(dynamicSort('-date'));
      }

      [latestRecord] = [...rawData].sort(dynamicSort('-date'));

      dataPagination = this.paginationData(parseData, page, limit);
    }

    const result = {
      data: dataPagination,
      totalOee,
      serial: deviceAss[0].serial,
      deviceName: deviceAss[0].device[0]?.name,
      type: deviceAss[0].workTimeDataSource,
      status: this.mapStatus(
        deviceAss[0].workTimeDataSource,
        latestRecord?.status,
        deviceAss[0].status,
      ),
    };
    const dataReturn = plainToInstance(
      DeviceStatusActivityInfoRequestDto,
      result,
      {
        excludeExtraneousValues: true,
      },
    );
    return new ResponseBuilder({
      result: dataReturn,
      meta: { total: rawData?.length || 0, page, size: limit },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async listDeviceStatusActivityInfo(
    payload: ListDeviceStatusActivityInfoRequestDto,
  ): Promise<any> {
    const { page, limit } = payload;
    const deviceAss =
      await this.deviceAssignmentRepository.detailDeviceAssignment(
        payload.deviceAssignmentId,
      );
    if (isEmpty(deviceAss)) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(await this.i18n.translate('error.NOT_FOUND'))
        .build();
    }
    const deviceAssignment: any = first(deviceAss);

    if (!deviceAssignment.workCenterId) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.DEVICE_IS_NOT_MANUFACTURING'),
        )
        .build();
    }
    const listAttributes =
      await this.attributeTypeRepository.findAllByCondition({
        _id: { $in: deviceAssignment.device[0].attributeType },
      });
    const unitIds = flatMap(listAttributes, 'unit');
    const units = await this.unitRepository.findAllByCondition({
      _id: {
        $in: unitIds,
      },
    });

    listAttributes.forEach((att) => {
      listAttributes[att._id.toString()] = {
        id: att._id.toString(),
        name: att.name,
        unit: units.find((u) => u._id === att.unit)?.name,
      } as any;
    });
    if (deviceAssignment?.workTimeDataSource === WorkTimeDataSourceEnum.MES) {
      return await this.listActivityByMes(
        deviceAss,
        page,
        limit,
        payload.startDate,
        payload.endDate,
        payload.sort,
      );
    }
    const productivityTarget = deviceAssignment.productivityTarget;
    const data = await this.deviceStatusRepository.listDeviceStatusActivityInfo(
      payload,
    );
    const raw = [];
    data.forEach((statusData) => {
      const attributes = statusData.attributes.map((att) => {
        return {
          id: listAttributes[att.key]?.id,
          name: listAttributes[att.key]?.name,
          value: att?.value,
          unit: listAttributes[att.key]?.unit,
        };
      });
      let actualItemPerMinutes = 0;
      let passItemPerMinutes = 0;
      if (statusData.status === DEVICE_STATUS_ENUM.ACTIVE) {
        const range = moment(statusData.endDate).diff(
          moment(statusData.startDate),
          'minutes',
        );
        actualItemPerMinutes = div(statusData.actualQuantity, range || 1);
        passItemPerMinutes = div(statusData.passQuantity, range || 1);
      }
      const dateInStatus = this.getDistanceDate(
        statusData.startDate,
        statusData.endDate,
      );

      let countActualQuantity = 0;
      let countPassQuantity = 0;
      dateInStatus.forEach((item) => {
        const { range } = item;
        let activeTime = 0;
        let rest = 0;
        let passQuantity = 0;
        let actualQuantity = 0;

        if (statusData.status === DEVICE_STATUS_ENUM.ACTIVE) {
          activeTime = range;
          passQuantity =
            countPassQuantity +
              Math.round(mul(passItemPerMinutes, activeTime)) >
            statusData.passQuantity
              ? Math.round(minus(statusData.passQuantity, countPassQuantity))
              : Math.round(mul(passItemPerMinutes, activeTime));
          actualQuantity =
            countActualQuantity +
              Math.round(mul(actualItemPerMinutes, activeTime)) >
            statusData.actualQuantity
              ? Math.round(
                  minus(statusData.actualQuantity, countActualQuantity),
                )
              : Math.round(mul(actualItemPerMinutes, activeTime));
        }
        if (statusData.status !== DEVICE_STATUS_ENUM.ACTIVE) {
          rest = range;
        }
        raw.push({
          date: moment(item.startDate)
            .set({ hour: 0, minute: 0, second: 0 })
            .toISOString(),
          activeTime,
          rest,
          passQuantity,
          actualQuantity,
          status: statusData.status,
          attributes,
        });
        countPassQuantity += Math.round(mul(passItemPerMinutes, activeTime));
        countActualQuantity += Math.round(
          mul(actualItemPerMinutes, activeTime),
        );
      });
    });
    const dateDatas = groupBy(
      raw,
      (data) => `${moment(data.date).format('DD/MM/YYYY')}`,
    );
    let rawData = [];
    for (const key in dateDatas) {
      const dateData = dateDatas[key];
      let a = 0;
      let p = 0;
      let q = 0;
      const dataItem = dateData.reduce(
        (acc, date) => {
          return {
            date: moment(new Date(date.date)).toISOString(),
            activeTime: acc.activeTime + date.activeTime,
            rest: acc.rest + date.rest,
            passQuantity: acc.passQuantity + date.passQuantity,
            actualQuantity: acc.actualQuantity + date.actualQuantity,
            stop: date.rest > 0 ? acc.stop + 1 : acc.stop,
            status: date.status,
            attributes: date.attributes,
          };
        },
        {
          date: null,
          activeTime: 0,
          rest: 0,
          passQuantity: 0,
          actualQuantity: 0,
          stop: 0,
          oee: 0,
          attributes: [],
          status: null,
        },
      );

      if (
        dataItem.passQuantity !== 0 &&
        dataItem.actualQuantity !== 0 &&
        dataItem.activeTime !== 0
      ) {
        a = 1; // thời gian làm kế hoạch = thời gian làm thực tế
        q = div(dataItem.passQuantity, dataItem.actualQuantity);
        p = div(
          +productivityTarget || 0,
          div(dataItem.actualQuantity, dataItem.activeTime),
        );
      }
      dataItem.oee = a * q * p * 100;

      rawData.push(dataItem);
    }

    if (payload.startDate) {
      rawData = rawData.filter((e) =>
        moment(e.date).isSameOrAfter(payload.startDate, 'day'),
      );
    }

    if (payload.endDate) {
      rawData = rawData.filter(
        (e) => e.date && moment(e.date).isSameOrBefore(payload.endDate, 'day'),
      );
    }

    if (!isEmpty(payload.sort)) {
      payload.sort.forEach((item) => {
        switch (item.column) {
          case 'date':
            const order =
              item.order.toLowerCase() === 'desc' ? 'date' : '-date';
            rawData = rawData.sort(dynamicSort(order));
            break;
          default:
            break;
        }
      });
    } else {
      rawData = rawData.sort(dynamicSort('-date'));
    }

    const [latestRecord] = [...rawData].sort(dynamicSort('-date'));

    let totalOee = 0;
    const totalData = rawData.reduce(
      (total, cur) => {
        return (total = {
          activeTime: total.activeTime + cur.activeTime,
          rest: total.rest + cur.rest,
          passQuantity: total.passQuantity + cur.passQuantity,
          actualQuantity: total.actualQuantity + cur.actualQuantity,
        });
      },
      {
        activeTime: 0,
        rest: 0,
        passQuantity: 0,
        actualQuantity: 0,
      },
    );
    if (
      totalData.activeTime &&
      totalData.passQuantity &&
      totalData.actualQuantity
    ) {
      const totalA = div(
        totalData.activeTime,
        plus(totalData.activeTime, totalData.rest || 0),
      );
      const totalP = div(totalData.passQuantity, totalData.actualQuantity);
      const totalQ = div(
        +productivityTarget || 0,
        div(totalData.actualQuantity, totalData.activeTime),
      );
      totalOee = totalA * totalP * totalQ * 100;
    }
    const dataPagination = this.paginationData(rawData, page, limit);
    const result = {
      data: dataPagination,
      totalOee,
      id: deviceAss[0]._id.toString(),
      serial: deviceAss[0].serial,
      deviceName: deviceAss[0].device[0]?.name,
      type: deviceAssignment.workTimeDataSource,
      status: this.mapStatus(
        deviceAssignment.workTimeDataSource,
        latestRecord?.status,
        deviceAssignment.status,
      ),
    };
    const dataReturn = plainToInstance(
      DeviceStatusActivityInfoRequestDto,
      result,
      {
        excludeExtraneousValues: true,
      },
    );
    return new ResponseBuilder({
      result: dataReturn,
      meta: { total: rawData.length, page, size: limit },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  paginationData(data: any[], page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return data.slice(offset, page * limit);
  }

  async createDeviceStatusActivity(
    payload: CreateDeviceStatusActivityRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { actives, deviceAssignmentId } = payload;
    const deviceAssignment = await this.deviceAssignmentRepository.findOneById(
      deviceAssignmentId,
    );
    if (!deviceAssignment) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.NOT_FOUND)
        .withMessage(
          await this.i18n.translate('error.DEVICE_ASSIGNMENT_NOT_FOUND'),
        )
        .build();
    }
    if (!deviceAssignment.workCenterId) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(
          await this.i18n.translate('error.DEVICE_IS_NOT_MANUFACTURING'),
        )
        .build();
    }
    const deviceStatusActivityData = [];
    for (let i = 0; i < actives.length; i++) {
      const data = actives[i];
      const { actualQuantity, passQuantity, startDate, endDate } = data;
      if (moment(startDate).isAfter(moment(endDate))) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.DATE_INVALID'))
          .build();
      }
      if (actualQuantity < passQuantity) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.QUANTITY_INVALID'))
          .build();
      }
      const checkExist = await this.deviceStatusRepository.findByDate(
        startDate,
        endDate,
        deviceAssignmentId,
      );
      if (checkExist) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(
            await this.i18n.translate('error.DUPLICATE_TIME_INFO_ACTIVE'),
          )
          .build();
      }
      deviceStatusActivityData.push({ ...data, deviceAssignmentId });
    }
    await this.deviceStatusRepository.createMany(deviceStatusActivityData);
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  private getDistanceDate(
    start: Date,
    end: Date,
  ): Array<{
    startDate: moment.Moment;
    endDate: moment.Moment;
    range: number;
  }> {
    const dates = [];

    const isInDay = moment(start).isSame(end, 'day');

    if (isInDay) {
      const range = moment(end).diff(moment(start), 'minutes');

      dates.push({
        startDate: moment(start),
        endDate: moment(end),
        range,
      });
    } else {
      for (
        let i = moment(start);
        i.isSameOrBefore(moment(end), 'day');
        i.add(1, 'day')
      ) {
        if (i.isSame(moment(start), 'day')) {
          const range =
            moment(start)
              .add(1, 'day')
              .startOf('day')
              .diff(moment(start), 'minute') + 1;
          dates.push({
            startDate: moment(start),
            endDate: moment(start).endOf('day'),
            range,
          });
        } else if (i.isSame(moment(end), 'day')) {
          const range = moment(end).diff(moment(end).startOf('day'), 'minute');
          dates.push({
            startDate: moment(end).startOf('day'),
            endDate: moment(end),
            range,
          });
        } else {
          dates.push({
            startDate: i.startOf('day').clone(),
            endDate: i.endOf('day').clone(),
            range:
              i.endOf('day').clone().diff(i.startOf('day').clone(), 'minute') +
              1,
          });
        }
      }
    }

    return dates;
  }

  async list(request: ListDeviceStatusQuery): Promise<ResponsePayload<any>> {
    const { data, count } =
      await this.deviceAssignmentRepository.listDeviceStatus(request);

    const dates = [];

    for (let index = 0; index < data.length; index++) {
      const { deviceStatuses } = data[index];
      const workTimeDataSource = data[index]?.workTimeDataSource;
      let maxDate: Date;
      let exportDate: Date;
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
        data[index]?.workCenterId || 0,
      );
      let actualItemPerMinutes = 0;
      let passItemPerMinutes = 0;
      let timeAction = 0;
      let timeRest = 0;
      let numOfStop = 0;
      let totalActualQuantity = 0;
      let totalPassQuantity = 0;
      let actualTime = 0;
      let planTime = 0;
      for (let i = 0; i < deviceStatuses.length; i++) {
        const currentDeviceStatus = deviceStatuses[0];
        maxDate = currentDeviceStatus.endDate;
        exportDate = currentDeviceStatus.updatedAt;
        const deviceStatus = deviceStatuses[i];

        if (deviceStatus.status === DEVICE_STATUS_ENUM.ACTIVE) {
          totalActualQuantity += deviceStatus.actualQuantity;
          totalPassQuantity += deviceStatus.passQuantity;
          actualTime += moment(deviceStatus.endDate).diff(
            deviceStatus.startDate,
            'minutes',
          );
        }
        planTime += moment(deviceStatus.endDate).diff(
          deviceStatus.startDate,
          'minutes',
        );

        if (moment(maxDate).isSameOrBefore(deviceStatus.endDate, 'day')) {
          const range = moment(deviceStatus.endDate).diff(
            moment(deviceStatus.startDate),
            'minutes',
          );

          const isInDay = moment(deviceStatus.startDate).isSame(
            deviceStatus.endDate,
            'day',
          );

          actualItemPerMinutes = div(deviceStatus.actualQuantity, range || 1);
          passItemPerMinutes = div(deviceStatus.passQuantity, range || 1);

          if (deviceStatus.status === DEVICE_STATUS_ENUM.ACTIVE) {
            if (!isInDay) {
              const range = moment(deviceStatus.endDate).diff(
                moment(maxDate).startOf('day'),
                'minutes',
              );
              timeAction += range;
            } else timeAction += range > 1440 ? 1440 : range;
          } else {
            if (!isInDay) {
              const range = moment(deviceStatus.endDate).diff(
                moment(maxDate).startOf('day'),
                'minutes',
              );
              timeRest += range;
            } else timeRest += range > 1440 ? 1440 : range;
          }

          if (deviceStatus.status === DEVICE_STATUS_ENUM.STOP) {
            numOfStop++;
          }
        }
      }

      if (!deviceStatuses.length) {
        data[index].deviceStatus = this.mapStatus(
          workTimeDataSource,
          undefined,
          undefined,
        );
      } else {
        data[index].deviceStatuses[0].date = maxDate;
        data[index].deviceStatuses[0].status = this.mapStatus(
          workTimeDataSource,
          data[index].deviceStatuses[0].status,
          data[index].status,
        );
        data[index].deviceStatuses[0].timeAction = timeAction;
        data[index].deviceStatuses[0].timeRest = timeRest;
        data[index].deviceStatuses[0].passQuantity = Math.round(
          timeAction * passItemPerMinutes,
        );
        data[index].deviceStatuses[0].actualQuantity = Math.round(
          timeAction * actualItemPerMinutes,
        );
        data[index].deviceStatuses[0].numOfStop = numOfStop;

        if (workTimeDataSource !== WorkTimeDataSourceEnum.INPUT)
          data[index].deviceStatuses[0].oee =
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
                  div(
                    response.totalQcPassQuantity,
                    data[index].timeAction || 1,
                  ) || 1,
                ) *
                100;
        else {
          data[index].deviceStatuses[0].oee =
            totalActualQuantity === 0 || isUndefined(totalActualQuantity)
              ? 0
              : div(actualTime, planTime || 1) *
                div(totalPassQuantity, totalActualQuantity) *
                div(
                  data[index]?.productivityTarget || 1,
                  div(totalActualQuantity, actualTime || 1) || 1,
                ) *
                100;
        }
      }
      if (exportDate) dates.push(exportDate);
    }

    const dataReturn = plainToInstance(ListDeviceStatusResponse, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder({
      dateExport: moment(Math.max(...dates)).toDate(),
      items: dataReturn,
      meta: { total: count, page: request.page, size: request.limit },
    })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  private mapStatus(
    workTimeDataSource: number,
    oldStatus: number,
    assignStatus: number,
  ): number {
    if (isUndefined(assignStatus) || isUndefined(oldStatus)) {
      if (workTimeDataSource === WorkTimeDataSourceEnum.MES)
        return DEVICE_STATUS_ENUM.IN_USE;
      return DEVICE_STATUS_ENUM.ACTIVE;
    }

    if (workTimeDataSource === WorkTimeDataSourceEnum.MES) {
      if (assignStatus === DEVICE_ASIGNMENTS_STATUS_ENUM.IN_USE)
        return DEVICE_STATUS_ENUM.ACTIVE;
      if (assignStatus === DEVICE_ASIGNMENTS_STATUS_ENUM.IN_MAINTAINING)
        return DEVICE_STATUS_ENUM.MAINTENANCE;
    }
    return oldStatus;
  }

  async listDeviceStatusBySerial(request: ListDeviceStatusBySerialRequestDto) {
    const { serial, startDate, endDate, page, limit } = request;
    const deviceAssign =
      await this.deviceAssignmentRepository.findOneByCondition({
        serial,
      });
    if (!deviceAssign) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }
    const data =
      (
        await this.listDeviceStatusActivityInfo({
          deviceAssignmentId: deviceAssign._id.toString(),
          startDate,
          endDate,
          page,
          limit: +limit,
        } as ListDeviceStatusActivityInfoRequestDto)
      )?.data || [];
    const res = data.result.data;

    const meta = {
      ...data.meta,
      id: data.result.id,
      serial: data.result.serial,
      totalOee: data.result.totalOee,
      deviceName: data.result.deviceName,
      status: data.result.status,
      type: data.result.type,
    };

    return new ResponseBuilder({ items: res, meta })
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }
}
