import { Cron, CronExpression } from '@nestjs/schedule';
import { Inject, Injectable } from '@nestjs/common';
import { WarningRepositoryInterface } from '@components/warning/interface/warning.repository.interface';
import { DeviceAssignmentRepositoryInterface } from '@components/device-assignment/interface/device-assignment.repository.interface';
import { DeviceAssignmentServiceInterface } from '@components/device-assignment/interface/device-assignment.service.interface';
import * as moment from 'moment';
import { DEFAULT_WARNING_SAFE_TIME, HISTORY_ACTION } from 'src/constant/common';
import { I18nRequestScopeService } from 'nestjs-i18n';
import {
  PERIOD_WARNING_TYPE_ENUM,
  WARNING_STATUS_ENUM,
  WARNING_TYPE_ENUM,
} from '@components/warning/warning.constant';
import { PERIOD_WARNING_PRIORITY_ENUM } from '@components/maintenance-period-warning/maintenance-period-warning.constant';
import { SupplyRepositoryInterface } from '@components/supply/interface/supply.repository.interface';
import { JobRepositoryInterface } from '@components/job/interface/job.repository.interface';
import { MaintainRequestRepositoryInterface } from '@components/maintain-request/interface/maintain-request.repository.interface';
import { DeviceRepositoryInterface } from '@components/device/interface/device.repository.interface';
import { plainToInstance } from 'class-transformer';
import { DeviceAssignmentResponseDto } from '@components/device-assignment/dto/response/list_device_assignment.response.dto';
import { first, flatMap, keyBy } from 'lodash';
import { SupplyTypeConstant } from '@components/supply/supply.constant';
import {
  JOB_STATUS_ENUM,
  JOB_TYPE_ENUM,
  JOB_TYPE_MAINTENANCE_ENUM,
} from '@components/job/job.constant';
import { MAINTAIN_REQUEST_STATUS_ENUM } from '@components/maintain-request/maintain-request.constant';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { DeviceAssignStatus } from 'src/models/device-assignment/device-assignment.schema';
import { GeneralMaintenanceParameterRepositoryInterface } from '@components/general-maintenance-parameter/interface/general-maintenance-parameter.repository.interface';

const NUMBER_RECORD = 100;
@Injectable()
export class CronService {
  constructor(
    @Inject('WarningRepositoryInterface')
    private warningRepository: WarningRepositoryInterface,

    @Inject('DeviceAssignmentRepositoryInterface')
    private deviceAssignmentRepository: DeviceAssignmentRepositoryInterface,

    @Inject('SupplyRepositoryInterface')
    private supplyRepository: SupplyRepositoryInterface,

    @Inject('JobRepositoryInterface')
    private jobRepository: JobRepositoryInterface,

    @Inject('MaintainRequestRepositoryInterface')
    private maintainRequestRepository: MaintainRequestRepositoryInterface,

    @Inject('DeviceRepositoryInterface')
    private deviceRepository: DeviceRepositoryInterface,

    @Inject('DeviceAssignmentServiceInterface')
    private deviceAssigmentService: DeviceAssignmentServiceInterface,

    @Inject('GeneralMaintenanceParameterRepositoryInterface')
    private generalMaintenanceParameterRepository: GeneralMaintenanceParameterRepositoryInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  //At 00:00 on day-of-month 1. cảnh báo check list hàng tháng
  @Cron('0 0 1 * *')
  async createWarningChecklist() {
    console.log(
      `run cron warning checklist: ${moment().format('DD-MM-YYYY HH:mm')}`,
    );

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
    const { count } =
      await this.deviceAssignmentRepository.deviceAssignmentWithRelation();
    let number = 1;
    if (count > NUMBER_RECORD) {
      number = Math.ceil(count / NUMBER_RECORD);
    }
    const userName = await this.i18n.translate('text.SYSTEM');
    const content = await this.i18n.translate(
      'text.SYSTEM_CREATE_WARNING_CHECKLIST_TEMPLATE',
    );
    const dataInsert = [];
    for (let i = 0; i < number; i++) {
      const { items = [] } =
        await this.deviceAssignmentRepository.deviceAssignmentWithRelation(
          NUMBER_RECORD,
          i + 1,
        );
      items?.forEach(async (deviceAssignment) => {
        let time = moment(deviceAssignment.usedAt);
        if (deviceAssignment.warning.length) {
          const warning = deviceAssignment.warning.find(
            (i) =>
              i.status === WARNING_STATUS_ENUM.COMPLETED &&
              i.type === WARNING_TYPE_ENUM.CHECKLIST_TEMPLATE,
          );
          if (warning) time = moment(warning.updatedAt);
        }
        const lastDateOfCurrentMonth = moment().endOf('month');
        const totalDay = lastDateOfCurrentMonth.diff(time, 'days');
        //totalDay > 0, time in current month
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
    }
    await this.warningRepository.createManyWarning(dataInsert);
  }

  // cảnh báo checklist hàng ngày
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async createWarningChecklistEveryDay() {
    console.log(
      `run cron warning checklist every day: ${moment().format(
        'DD-MM-YYYY HH:mm',
      )}`,
    );
    const { count } =
      await this.deviceAssignmentRepository.deviceAssignmentWithRelation();
    let number = 1;
    if (count > NUMBER_RECORD) {
      number = !(count % NUMBER_RECORD)
        ? count / NUMBER_RECORD
        : Math.ceil(count / NUMBER_RECORD);
    }
    const userName = await this.i18n.translate('text.SYSTEM');
    const content = await this.i18n.translate(
      'text.SYSTEM_CREATE_WARNING_CHECKLIST_TEMPLATE',
    );
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
    const dataInsert = [];
    for (let i = 0; i < number; i++) {
      const { items = [] } =
        await this.deviceAssignmentRepository.deviceAssignmentWithRelation(
          NUMBER_RECORD,
          i + 1,
        );
      items?.forEach(async (deviceAssignment) => {
        let time = moment(deviceAssignment.usedAt);
        if (deviceAssignment.warning.length) {
          const warning = deviceAssignment.warning.find(
            (i) =>
              i.status === WARNING_STATUS_ENUM.COMPLETED &&
              i.type === WARNING_TYPE_ENUM.CHECKLIST_TEMPLATE,
          );
          if (warning) time = moment(warning.updatedAt);
        }
        const lastDateOfCurrentMonth = moment().endOf('month');
        const totalDay = lastDateOfCurrentMonth.diff(time, 'days');
        //totalDay > 0, time in current month
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
    }
    await this.warningRepository.createManyWarning(dataInsert);
  }

  // cảnh báo bảo dưỡng định kì
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async warningMaintancePeriodDevice() {
    console.log(
      `run cron warning maintain period device: ${moment().format(
        'DD-MM-YYYY HH:mm',
      )}`,
    );

    const warnings = await this.warningRepository.findAllByCondition({
      type: WARNING_TYPE_ENUM.PERIOD_MANTANCE,
      maintanceType: PERIOD_WARNING_TYPE_ENUM.PERIOD_WARNING_DEVICE,
    });
    const warningList = keyBy(
      warnings,
      (warning) =>
        `${warning.deviceAssignmentId.toString()}-${moment(warning.scheduleDate)
          .format('DD-MM-YYYY')
          .toString()}`,
    );

    let deviceAssignments =
      await this.deviceAssignmentRepository.getDeviceAssignment();
    const maintenanceParams =
      await this.generalMaintenanceParameterRepository.findAll();
    const timeWarningSafe =
      first(maintenanceParams)?.time || DEFAULT_WARNING_SAFE_TIME; // Thời gian cảnh báo an toàn
    const totalActive = 500; // hoạt động thực tế cộng dồn
    const totalActiveLatest = 200; // hoạt động thực tế  gần nhất
    deviceAssignments = deviceAssignments.filter((deviceAssign) => {
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
    const items = deviceAssignments?.map((deviceAssign) => {
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
    });
    this.warningRepository.createManyWarning(items);
  }

  // cảnh báo thiết bị sắp hỏng
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async warningMaintancePeriodDeviceError() {
    console.log(
      `run cron warning maintain period device error: ${moment().format(
        'DD-MM-YYYY HH:mm',
      )}`,
    );

    const warnings = await this.warningRepository.findAllByCondition({
      type: WARNING_TYPE_ENUM.PERIOD_MANTANCE,
      maintanceType: PERIOD_WARNING_TYPE_ENUM.PERIOD_WARNING_DEVICE_ERROR,
    });
    const warningList = keyBy(
      warnings,
      (warning) =>
        `${warning.deviceAssignmentId.toString()}-${moment(warning.scheduleDate)
          .format('DD-MM-YYYY')
          .toString()}`,
    );
    const deviceAssignment =
      await this.deviceAssignmentRepository.getDeviceAssignment();
    const maintenanceParams =
      await this.generalMaintenanceParameterRepository.findAll();
    const totalActive = 500; // hoạt động thực tế cộng dồn
    const totalActiveLatest = 200; // hoạt động thực tế  gần nhất
    const timeWarningSafe = first(maintenanceParams)?.time || 2; // Thời gian cảnh báo an toàn
    const deviceAssignments = deviceAssignment
      .filter((assignment) => {
        const mttfIndex =
          assignment.mttfIndex ?? assignment.information.mttfIndex;
        return (
          mttfIndex - totalActive < timeWarningSafe * totalActiveLatest &&
          !warningList[
            `${assignment._id.toString()}-${moment()
              .add(timeWarningSafe, 'days')
              .format('DD-MM-YYYY')
              .toString()}`
          ]
        );
      })
      .flat();
    const text = await this.i18n.translate(
      'text.MAINTAINANCE_DEVICE_ERROR_WARNING',
    );
    const userName = await this.i18n.translate('text.SYSTEM');
    const items = [];
    deviceAssignments?.forEach((deviceAssignment) => {
      const deviceName = deviceAssignment.device[0].name;
      const scheduleDate = moment().add(timeWarningSafe, 'days');
      items.push({
        deviceAssignmentId: deviceAssignment._id,
        priority: PERIOD_WARNING_PRIORITY_ENUM.BLOCKER,
        maintanceType: PERIOD_WARNING_TYPE_ENUM.PERIOD_WARNING_DEVICE_ERROR,
        status: WARNING_STATUS_ENUM.CREATED,
        name: text.replace(':deviceName', deviceName),
        description: text.replace(':deviceName', deviceName),
        completeExpectedDate: scheduleDate
          .add(+deviceAssignment.mttrIndex, 'minutes')
          .add(+deviceAssignment.mttaIndex, 'minutes'),
        type: WARNING_TYPE_ENUM.PERIOD_MANTANCE,
        scheduleDate,
        histories: [
          {
            content: text.replace(':deviceName', deviceName),
            userName: userName,
            createdAt: new Date(),
            action: HISTORY_ACTION.CREATED,
          },
        ],
      });
    });
    this.warningRepository.createManyWarning(items);
  }

  // cảnh báo phụ tùng sắp hỏng
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async warningMaintancePeriodAccessoriesError() {
    console.log(
      `run cron warning maintain period supply error: ${moment().format(
        'DD-MM-YYYY HH:mm',
      )}`,
    );

    const warnings = await this.warningRepository.findAllByCondition({
      type: WARNING_TYPE_ENUM.PERIOD_MANTANCE,
      maintanceType: PERIOD_WARNING_TYPE_ENUM.PERIOD_WARNING_SUPPLY_ERROR,
    });
    const warningList = keyBy(
      warnings,
      (warning) =>
        `${warning.deviceAssignmentId.toString()}-${moment(warning.scheduleDate)
          .format('DD-MM-YYYY')
          .toString()}`,
    );
    const maintenanceParams =
      await this.generalMaintenanceParameterRepository.findAll();
    const totalActive = 500; // hoạt động thực tế cộng dồn
    const totalActiveLatest = 200; // hoạt động thực tế  gần nhất
    const timeWarningSafe = first(maintenanceParams)?.time || 2; // Thời gian cảnh báo an toàn
    let deviceAssignments =
      await this.deviceAssignmentRepository.getDeviceAssignment();
    deviceAssignments = deviceAssignments.filter((deviceAssign) => {
      return !warningList[
        `${deviceAssign._id.toString()}-${moment()
          .add(timeWarningSafe, 'days')
          .format('DD-MM-YYYY')
          .toString()}`
      ];
    });
    const deviceAssignmentFormated: any = plainToInstance(
      DeviceAssignmentResponseDto,
      deviceAssignments,
      {
        excludeExtraneousValues: true,
      },
    );
    const deviceAssignmentObj = keyBy(deviceAssignmentFormated, 'id');
    const deviceSupplies = deviceAssignmentFormated
      ?.map((assignment) => {
        return assignment.device.information.supplies.map((supply) => {
          const supplyIndex = assignment.supplyIndex.find(
            (sup) => sup.supplyId.toString() === supply.supplyId.toString(),
          );
          const mttfIndex = supplyIndex?.mttfIndex ?? supply.mttfIndex;
          return (
            mttfIndex - totalActive < timeWarningSafe * totalActiveLatest && {
              ...supply,
              ...{ deviceAssignmentId: assignment.id },
            }
          );
        });
      })
      .flat();
    const validSupplies = deviceSupplies.reduce(
      (previousValue, currentValue) => {
        if (currentValue) {
          previousValue.push(currentValue);
        }
        return previousValue;
      },
      [],
    );
    const supplyIds = validSupplies.map((supply) => supply.supplyId);
    const supplies = await this.supplyRepository.getByIds(supplyIds);
    const supplyObj = keyBy(supplies, '_id');
    const supplyMapType = validSupplies.map((supply) => ({
      ...supply,
      ...{
        type: supplyObj[supply.supplyId]
          ? supplyObj[supply.supplyId].type
          : undefined,
      },
    }));
    const text = await this.i18n.translate(
      'text.MAINTAINANCE_SUPPLY_ERROR_WARNING',
    );
    const warningSupplyError = await this.warningRepository.findAllByCondition({
      maintanceType: PERIOD_WARNING_TYPE_ENUM.PERIOD_WARNING_SUPPLY_ERROR,
      $or: [
        { status: WARNING_STATUS_ENUM.CREATED },
        { status: WARNING_STATUS_ENUM.CONFIRMED },
        { status: WARNING_STATUS_ENUM.IN_PROGRESS },
      ],
    });
    const userName = await this.i18n.translate('text.SYSTEM');
    const content = await this.i18n.translate(
      'text.SYSTEM_CREATE_WARNING_MAINTANCE_PEROID',
    );

    const data = supplyMapType.reduce((previousValue, currentValue) => {
      const findWarningExist = warningSupplyError.find(
        (warning) =>
          `${warning.deviceAssignmentId}` === currentValue.deviceAssignmentId &&
          `${warning.maintanceSupplyId}` === currentValue.supplyId,
      );
      if (
        currentValue.type === SupplyTypeConstant.ACCESSORY &&
        !findWarningExist
      ) {
        previousValue.push({
          deviceAssignmentId: currentValue.deviceAssignmentId,
          maintanceSupplyId: currentValue.supplyId,
          priority: PERIOD_WARNING_PRIORITY_ENUM.BLOCKER,
          maintanceType: PERIOD_WARNING_TYPE_ENUM.PERIOD_WARNING_SUPPLY_ERROR,
          status: WARNING_STATUS_ENUM.CREATED,
          name: `${text.replace(
            '{deviceName}',
            deviceAssignmentObj[currentValue.deviceAssignmentId].device.name,
          )}`,
          description: `${text.replace(
            '{deviceName}',
            deviceAssignmentObj[currentValue.deviceAssignmentId].device.name,
          )}`,
          completeExpectedDate: moment()
            .add(timeWarningSafe, 'days')
            .add(+currentValue.mttrIndex, 'minutes')
            .add(+currentValue.mttaIndex, 'minutes'),
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
        });
      }
      return previousValue;
    }, []);
    await this.warningRepository.createManyWarning(data);
  }

  // cảnh báo bảo dưỡng phụ tùng
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async warningMaintancePeriodAccessories() {
    console.log(
      `run cron warning maintain period supply: ${moment().format(
        'DD-MM-YYYY HH:mm',
      )}`,
    );

    const deviceAssignment =
      await this.deviceAssignmentRepository.getDeviceAssignment();
    const deviceAssignmentFormated: any = plainToInstance(
      DeviceAssignmentResponseDto,
      deviceAssignment,
      {
        excludeExtraneousValues: true,
      },
    );
    const deviceAssignmentObj = keyBy(deviceAssignmentFormated, 'id');
    const totalActive = 500; // hoạt động thực tế cộng dồn
    const totalActiveLatest = 200; // hoạt động thực tế  gần nhấtconst maintenanceParams =
    const maintenanceParams =
      await this.generalMaintenanceParameterRepository.findAll();
    const timeWarningSafe = first(maintenanceParams)?.time || 2; // Thời gian cảnh báo an toàn
    const deviceSupplies = deviceAssignmentFormated
      .map((assignment) => {
        return assignment.device.information.supplies.map((supply) => {
          return (
            supply.maintenancePeriod &&
            +supply.maintenancePeriod - totalActive <
              timeWarningSafe * totalActiveLatest && {
              ...supply,
              deviceAssignmentId: assignment.id,
            }
          );
        });
      })
      .flat();
    const validSupplies = deviceSupplies.filter((supplies) => supplies);
    const supplyIds = flatMap(validSupplies, (value) =>
      value.supplyId.toString(),
    );
    const supplies = await this.supplyRepository.findAllByCondition({
      _id: { $in: supplyIds },
    });
    const supplyObj = keyBy(supplies, '_id');
    const supplyMapType = validSupplies.map((supply) => ({
      ...supply,
      type: supplyObj[supply.supplyId.toString()]
        ? supplyObj[supply.supplyId].type
        : undefined,
    }));
    const text = await this.i18n.translate(
      'text.NAME_MAINTAINANCE_SUPPLY_WARNING',
    );
    const warningSupply = await this.warningRepository.findAllByCondition({
      maintanceType: PERIOD_WARNING_TYPE_ENUM.PERIOD_WARNING_SUPPLY,
      $or: [
        { status: WARNING_STATUS_ENUM.CREATED },
        { status: WARNING_STATUS_ENUM.CONFIRMED },
        { status: WARNING_STATUS_ENUM.IN_PROGRESS },
      ],
    });
    const userName = await this.i18n.translate('text.SYSTEM');
    const content = await this.i18n.translate(
      'text.SYSTEM_CREATE_WARNING_MAINTANCE_PEROID',
    );
    const data = supplyMapType.reduce((previousValue, currentValue) => {
      const findWairningExist = warningSupply.find(
        (warning) =>
          warning.deviceAssignmentId.toString() ===
            currentValue.deviceAssignmentId.toString() &&
          warning.maintanceSupplyId.toString() ===
            currentValue.supplyId.toString() &&
          warning.maintanceType ===
            PERIOD_WARNING_TYPE_ENUM.PERIOD_WARNING_SUPPLY,
      );
      if (
        currentValue.type === SupplyTypeConstant.ACCESSORY &&
        !findWairningExist
      ) {
        previousValue.push({
          deviceAssignmentId: currentValue.deviceAssignmentId,
          maintanceSupplyId: currentValue.supplyId,
          priority: PERIOD_WARNING_PRIORITY_ENUM.MAJOR,
          maintanceType: PERIOD_WARNING_TYPE_ENUM.PERIOD_WARNING_SUPPLY,
          status: WARNING_STATUS_ENUM.CREATED,
          name: text.replace(
            '{deviceName}',
            deviceAssignmentObj[currentValue.deviceAssignmentId].device.name,
          ),
          description: text.replace(
            '{deviceName}',
            deviceAssignmentObj[currentValue.deviceAssignmentId].device.name,
          ),
          completeExpectedDate: moment()
            .add(timeWarningSafe, 'days')
            .add(+currentValue.mttrIndex, 'minutes')
            .add(+currentValue.mttaIndex, 'minutes'),
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
        });
      }
      return previousValue;
    }, []);
    await this.warningRepository.createManyWarning(data);
  }

  // cảnh báo thay thế vật tư
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async warningMaintancePeriodReplaceSupply() {
    console.log(
      `run cron warning maintain period replace accessory: ${moment().format(
        'DD-MM-YYYY HH:mm',
      )}`,
    );

    const deviceAssignment =
      await this.deviceAssignmentRepository.getDeviceAssignment();
    const deviceAssignmentFormated: any = plainToInstance(
      DeviceAssignmentResponseDto,
      deviceAssignment,
      {
        excludeExtraneousValues: true,
      },
    );
    const deviceAssignmentObj = keyBy(deviceAssignmentFormated, 'id');
    const totalActive = 500; // hoạt động thực tế cộng dồn
    const totalActiveLatest = 200; // hoạt động thực tế  gần nhất
    const maintenanceParams =
      await this.generalMaintenanceParameterRepository.findAll();
    const timeWarningSafe = first(maintenanceParams)?.time || 2; // Thời gian cảnh báo an toàn
    const deviceSupplies = deviceAssignmentFormated
      .map((assignment) => {
        return assignment.device.information.supplies.map(
          (supply) =>
            supply.useDate &&
            +supply.useDate - totalActive <
              timeWarningSafe * totalActiveLatest && {
              ...supply,
              deviceAssignmentId: assignment.id,
            },
        );
      })
      .flat();
    const validSupplies = deviceSupplies.reduce(
      (previousValue, currentValue) => {
        if (currentValue) {
          previousValue.push(currentValue);
        }
        return previousValue;
      },
      [],
    );
    const supplyIds = validSupplies.map((supply) => supply.supplyId);
    const supplies = await this.supplyRepository.getByIds(supplyIds);
    const supplyObj = keyBy(supplies, '_id');
    const supplyMapType = validSupplies.map((supply) => ({
      ...supply,
      type: supplyObj[supply.supplyId]
        ? supplyObj[supply.supplyId].type
        : undefined,
    }));

    const warningSupply = await this.warningRepository.findAllByCondition({
      maintanceType: PERIOD_WARNING_TYPE_ENUM.PERIOD_WARNING_REPLACE_ACCESSORY,
      $or: [
        { status: WARNING_STATUS_ENUM.CREATED },
        { status: WARNING_STATUS_ENUM.CONFIRMED },
        { status: WARNING_STATUS_ENUM.IN_PROGRESS },
      ],
    });
    const text = await this.i18n.translate(
      'text.MAINTAINANCE_REPLACE_SUPPLY_WARNING',
    );
    const userName = await this.i18n.translate('text.SYSTEM');
    const content = await this.i18n.translate(
      'text.SYSTEM_CREATE_WARNING_MAINTANCE_PEROID',
    );

    const data = supplyMapType.reduce((previousValue, currentValue) => {
      const findWarningExist = warningSupply.find(
        (warning) =>
          `${warning.deviceAssignmentId}` === currentValue.deviceAssignmentId &&
          `${warning.maintanceSupplyId}` === currentValue.supplyId,
      );
      if (
        !findWarningExist &&
        currentValue.type === SupplyTypeConstant.SUPPLY
      ) {
        previousValue.push({
          deviceAssignmentId: currentValue.deviceAssignmentId,
          maintanceSupplyId: currentValue.supplyId,
          priority: PERIOD_WARNING_PRIORITY_ENUM.BLOCKER,
          maintanceType:
            PERIOD_WARNING_TYPE_ENUM.PERIOD_WARNING_REPLACE_ACCESSORY,
          status: WARNING_STATUS_ENUM.CREATED,
          name: text.replace(
            '{deviceName}',
            deviceAssignmentObj[currentValue.deviceAssignmentId].device.name,
          ),
          description: text.replace(
            '{deviceName}',
            deviceAssignmentObj[currentValue.deviceAssignmentId].device.name,
          ),
          completeExpectedDate: moment()
            .add(timeWarningSafe, 'days')
            .add(+currentValue.mttrIndex, 'minutes')
            .add(+currentValue.mttaIndex, 'minutes'),
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
        });
      }
      return previousValue;
    }, []);
    await this.warningRepository.createManyWarning(data);
  }

  // tự động hoàn thành công việc sau 2 ngày đã thực hiện
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async resolveJobCompleted() {
    console.log(
      `run cron auto resolve job: ${moment().format('DD-MM-YYYY HH:mm')}`,
    );
    const dayAutoResolve = 2;

    const userName = await this.i18n.translate('text.SYSTEM');
    const messageCompletedJob = await this.i18n.translate(
      'text.COMPLETED_JOB_HISTORY',
    );
    const jobs = await this.jobRepository.findAllByCondition({
      status: JOB_STATUS_ENUM.COMPLETED,
    });
    jobs.forEach(async (job) => {
      if (
        job.type === JOB_TYPE_ENUM.MAINTENANCE_REQUEST &&
        job.executionDateTo &&
        moment(job.executionDateTo).add(2, 'days').isAfter(new Date())
      ) {
        const maintainRequest =
          await this.maintainRequestRepository.findOneById(job.jobTypeId);
        if (!maintainRequest) return false;
        const deviceAssginment =
          await this.deviceAssignmentRepository.findOneById(
            maintainRequest.deviceAssignmentId,
          );
        if (!deviceAssginment) return false;
        const text = await this.i18n.translate(
          'text.COMPLETED_MAINTAIN_REQUEST_HISTORY',
        );

        await Promise.all([
          this.maintainRequestRepository.findByIdAndUpdate(
            maintainRequest._id,
            {
              status: MAINTAIN_REQUEST_STATUS_ENUM.COMPLETED,
              $push: {
                histories: {
                  userId: 0,
                  action: HISTORY_ACTION.COMPLETED,
                  content: `${userName} ${text}`,
                },
              },
            },
          ),
          this.updateIndex(job, deviceAssginment, maintainRequest),
        ]);
      }
      if (job.type !== JOB_TYPE_ENUM.MAINTENANCE_REQUEST) {
        if (
          job.type === JOB_TYPE_ENUM.WARNING &&
          job.executionDateTo &&
          moment(job.executionDateTo)
            .add(dayAutoResolve, 'days')
            .isAfter(new Date())
        ) {
          const warning = await this.warningRepository.findOneById(
            job.jobTypeId,
          );
          if (!warning) return false;
          const deviceAssginment =
            await this.deviceAssignmentRepository.findOneById(
              warning.deviceAssignmentId,
            );
          if (!deviceAssginment) return false;
          await Promise.all([
            this.warningRepository.findByIdAndUpdate(job.jobTypeId, {
              status: WARNING_STATUS_ENUM.COMPLETED,
            }),
            this.updateIndex(job, deviceAssginment, warning),
          ]);
        }
        if (
          (job.type === JOB_TYPE_ENUM.PERIOD_CHECKLIST ||
            job.type === JOB_TYPE_ENUM.PERIOD_MAINTAIN) &&
          job.executionDateTo &&
          moment(job.executionDateTo)
            .add(dayAutoResolve, 'days')
            .isAfter(new Date())
        ) {
          await this.warningRepository.findByIdAndUpdate(job.jobTypeId, {
            status: WARNING_STATUS_ENUM.COMPLETED,
          });
        }
      }
      await this.jobRepository.findByIdAndUpdate(`${job._id}`, {
        status: JOB_STATUS_ENUM.RESOLVED,
        $push: {
          histories: {
            userId: 0,
            action: HISTORY_ACTION.COMPLETED,
            content: `${userName} ${messageCompletedJob}`,
          },
        },
      });
    });
  }

  // tự động chuyển công việc thành quá hạn
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async updateJobToOutOfDate() {
    console.log(
      `run cron update job to out of date: ${moment().format(
        'DD-MM-YYYY HH:mm',
      )}`,
    );

    const messageOutOfDateJob = await this.i18n.translate(
      'text.OUT_OF_DATE_JOB_HISTORY',
    );
    const jobsOutOfDate = await this.jobRepository.findAllByCondition({
      status: JOB_STATUS_ENUM.TO_DO,
      planTo: { $lt: new Date() },
    });
    jobsOutOfDate.forEach(async (job) => {
      await this.jobRepository.findByIdAndUpdate(`${job._id}`, {
        status: JOB_STATUS_ENUM.OUT_OF_DATE,
        $push: {
          histories: {
            userId: 0,
            action: HISTORY_ACTION.UPDATED,
            content: messageOutOfDateJob,
          },
        },
      });
    });

    const jobsLate = await this.jobRepository.findAllByCondition({
      status: JOB_STATUS_ENUM.IN_PROGRESS,
      planTo: { $lt: new Date() },
    });
    jobsLate.forEach(async (job) => {
      await this.jobRepository.findByIdAndUpdate(`${job._id}`, {
        status: JOB_STATUS_ENUM.LATE,
        $push: {
          histories: {
            userId: 0,
            action: HISTORY_ACTION.UPDATED,
            content: messageOutOfDateJob,
          },
        },
      });
    });
  }

  async updateIndex(job, deviceAssginment, object) {
    if (job.result.maintenanceType === JOB_TYPE_MAINTENANCE_ENUM.MAINTENANCE) {
      const { mtbfIndex, mttaIndex, mttrIndex } =
        this.deviceAssigmentService.calculateDeviceAssignmentIndexes(
          job,
          deviceAssginment,
          object,
        );
      const information =
        await this.deviceAssigmentService.updateDeviceAssignInfomation(
          deviceAssginment,
          object,
        );

      const totalMTBF =
        (deviceAssginment.maintainRequestHistories
          .map((history) => history.mtbfIndex)
          .reduce((accumulator, current) => accumulator + current, 0) +
          mtbfIndex) /
        (deviceAssginment.maintainRequestHistories.length + 1);
      const totalMTTA =
        (deviceAssginment.maintainRequestHistories
          .map((history) => history.mttaIndex)
          .reduce((accumulator, current) => accumulator + current, 0) +
          mttaIndex) /
        (deviceAssginment.maintainRequestHistories.length + 1);
      const totalMTTR =
        (deviceAssginment.maintainRequestHistories
          .map((history) => history.mttrIndex)
          .reduce((accumulator, current) => accumulator + current, 0) +
          mttrIndex) /
        (deviceAssginment.maintainRequestHistories.length + 1);
      await Promise.all([
        this.deviceAssignmentRepository.findByIdAndUpdate(
          `${deviceAssginment._id}`,
          {
            mttrIndex: totalMTTR,
            mtbfIndex: totalMTBF,
            mttaIndex: totalMTTA,
            status: DeviceAssignStatus.Used,
            $push: {
              maintainRequestHistories: {
                mtbfIndex,
                mttrIndex,
                mttaIndex,
                maintainRequestId: object._id,
              },
            },
            information,
          },
        ),
        // this.deviceRepository.findByIdAndUpdate(`${deviceAssginment.deviceId}`, {
        //   status: DeviceStatus.Used,
        // }),
      ]);
    }
    if (job.result.maintenanceType === JOB_TYPE_MAINTENANCE_ENUM.REPLACE) {
      const { mttfIndex, mttaIndex, mttrIndex } =
        this.deviceAssigmentService.calculateDeviceAssignmentIndexes(
          job,
          deviceAssginment,
          object,
        );
      const information =
        await this.deviceAssigmentService.updateDeviceAssignInfomation(
          deviceAssginment,
          object,
        );

      const totalMTTF =
        deviceAssginment.maintainRequestHistories
          .map((history) => history.mtbfIndex)
          .reduce((accumulator, current) => accumulator + current, 0) +
        mttfIndex;
      const totalMTTA =
        (deviceAssginment.maintainRequestHistories
          .map((history) => history.mttaIndex)
          .reduce((accumulator, current) => accumulator + current, 0) +
          mttaIndex) /
        (deviceAssginment.maintainRequestHistories.length + 1);
      const totalMTTR =
        (deviceAssginment.maintainRequestHistories
          .map((history) => history.mttrIndex)
          .reduce((accumulator, current) => accumulator + current, 0) +
          mttrIndex) /
        (deviceAssginment.maintainRequestHistories.length + 1);

      this.deviceAssignmentRepository.findByIdAndUpdate(
        `${deviceAssginment._id}`,
        {
          mttrIndex: totalMTTR,
          mttfIndex: totalMTTF,
          mttaIndex: totalMTTA,
          status: DeviceAssignStatus.Scrap,
          information,
        },
      );
    }
  }
}
