import { Injectable } from '@nestjs/common';
import { MaintenancePeriodWarning } from 'src/models/maintenance-period-warning/maintenance-period-warning.model';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MaintenancePeriodWarningRepositoryInterface } from '@components/maintenance-period-warning/interface/maintenance-period-warning.repository.interface';

@Injectable()
export class MaintenancePeriodWarningRepository
  extends BaseAbstractRepository<MaintenancePeriodWarning>
  implements MaintenancePeriodWarningRepositoryInterface {
  constructor(
    @InjectModel('MaintenancePeriodWarning')
    private readonly maintenancePeriodWarningModel: Model<MaintenancePeriodWarning>,
  ) {
    super(maintenancePeriodWarningModel);
  }
}
