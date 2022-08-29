import { Controller, Injectable, Get, Inject } from '@nestjs/common';
import { MaintenancePeriodWarningServiceInterface } from './interface/maintenance-period-warning.service.interface';

@Injectable()
@Controller('maintenance-period-warnings')
export class MaintenancePeriodWarningController {
  constructor(
    @Inject('MaintenancePeriodWarningServiceInterface')
    private readonly maintenancePeriodWarningServiceInterface: MaintenancePeriodWarningServiceInterface
  ) {}
}
