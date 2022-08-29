import { CronServiceInterface } from './interface/cron.service.interface';
import { Controller, Injectable, Inject, Get } from '@nestjs/common';

@Injectable()
@Controller('cron')
export class CronController {
  constructor(
    @Inject('CronServiceInterface')
    private readonly cronService: CronServiceInterface,
  ) {}

  @Get('/cron/warning-checklist')
  runCronWarningChecklist(): void {
    return this.cronService.createWarningChecklist();
  }

  @Get('/cron/warning-checklist-every-day')
  runCronWarningChecklistEveryday(): void {
    return this.cronService.createWarningChecklistEveryDay();
  }

  @Get('/cron/warning-maintain-peroid-device-error')
  runCronWarningMaintancePeriodDeviceError(): void {
    return this.cronService.warningMaintancePeriodDeviceError();
  }

  @Get('/cron/warning-maintain-peroid-device')
  runCronWarningMaintancePeriodDevice(): void {
    return this.cronService.warningMaintancePeriodDevice();
  }

  @Get('/cron/warning-maintain-peroid-supply-error')
  runCronWarningMaintancePeriodAccessoriesError(): void {
    return this.cronService.warningMaintancePeriodAccessoriesError();
  }

  @Get('/cron/warning-maintain-peroid-supply')
  runCronWarningMaintancePeriodAccessories(): void {
    return this.cronService.warningMaintancePeriodAccessories();
  }

  @Get('/cron/warning-maintain-peroid-replace-accessory')
  runCronWarningMaintancePeriodReplaceAsscessory(): void {
    return this.cronService.warningMaintancePeriodReplaceSupply();
  }
  @Get('/cron/update-job-completed-to-resolve')
  runCronUpdateJobFromCompletedToResolve(): void {
    return this.cronService.resolveJobCompleted();
  }

  @Get('/cron/update-job-to-out-of-date')
  runCronUpdateJobToOutOfDate(): void {
    return this.cronService.updateJobToOutOfDate();
  }
}
