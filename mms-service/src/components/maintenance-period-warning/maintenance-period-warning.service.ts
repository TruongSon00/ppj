import { DeviceRepositoryInterface } from '@components/device/interface/device.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { DeviceAssignmentRepository } from 'src/repository/device-assignment/device-assignment.repository';
import { MaintenancePeriodWarningRepositoryInterface } from './interface/maintenance-period-warning.repository.interface';
import { MaintenancePeriodWarningServiceInterface } from './interface/maintenance-period-warning.service.interface';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import {
  PERIOD_WARNING_PRIORITY_ENUM,
  PERIOD_WARNING_TYPE_ENUM,
} from './maintenance-period-warning.constant';

@Injectable()
export class MaintenancePeriodWarningService
  implements MaintenancePeriodWarningServiceInterface
{
  constructor(
    @Inject('MaintenancePeriodWarningRepositoryInterface')
    private readonly maintenancePeriodWarningRepository: MaintenancePeriodWarningRepositoryInterface,

    @Inject('DeviceRepositoryInterface')
    private readonly deviceRepository: DeviceRepositoryInterface,

    @Inject('DeviceAssignmentRepositoryInterface')
    private readonly deviceAssignmentRepository: DeviceAssignmentRepository,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async createMaintancePeriodSupply(
    supplyId: string,
    type: number,
  ): Promise<any> {
    const device = await this.deviceRepository.getDeviceBySupply(supplyId);
    const deviceAssignment =
      await this.deviceAssignmentRepository.getDeviceAssignmentByDevice(
        device._id,
      );
    const data = {
      deviceAssignmentId: deviceAssignment._id,
      supplyId: supplyId,
      priority:
        type === PERIOD_WARNING_TYPE_ENUM.PERIOD_WARNING_SUPPLY
          ? PERIOD_WARNING_PRIORITY_ENUM.MAJOR
          : PERIOD_WARNING_PRIORITY_ENUM.BLOCKER,
      type: type,
    };
    if (type === PERIOD_WARNING_TYPE_ENUM.PERIOD_WARNING_SUPPLY) {
      const text = await this.i18n.translate(
        'text.NAME_MAINTAINANCE_SUPPLY_WARNING',
      );

      const translate = text.replace('{deviceName}', device.name);
      data['name'] = translate;
      data['description'] = `${translate}`;
    }
    if (type === PERIOD_WARNING_TYPE_ENUM.PERIOD_WARNING_REPLACE_ACCESSORY) {
      const text = await this.i18n.translate(
        'text.MAINTAINANCE_REPLACE_SUPPLY_WARNING',
      );

      const translate = text.replace('{deviceName}', device.name);
      data['name'] = translate;
      data['description'] = `${translate}`;
    }
    if (type === PERIOD_WARNING_TYPE_ENUM.PERIOD_WARNING_SUPPLY_ERROR) {
      const text = await this.i18n.translate(
        'text.MAINTAINANCE_SUPPLY_ERROR_WARNING',
      );

      const translate = `${text.replace('{deviceName}', device.name)}`;
      data['name'] = translate;
      data['description'] = translate;
    }
    await this.maintenancePeriodWarningRepository.create(data);
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async createMaintancePeriodDevice(deviceAssignmentId: string): Promise<any> {
    const deviceAssignment =
      await this.deviceAssignmentRepository.detailDeviceAssignment(
        deviceAssignmentId,
      );
    const text = await this.i18n.translate(
      'text.NAME_MAINTENANCE_DEVICE_WARNING',
    );
    const data = {
      name: `${text} ${deviceAssignment[0].device[0].name}`,
      description: `${text} ${deviceAssignment[0].device[0].name} theo lịch`,
      serial: deviceAssignment[0].serial,
      deviceAssignmentId,
      priority: PERIOD_WARNING_PRIORITY_ENUM.MAJOR,
    };
    const request = await this.maintenancePeriodWarningRepository.create({
      ...data,
    });
    return new ResponseBuilder(request)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }
}
