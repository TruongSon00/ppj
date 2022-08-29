import { DeviceAssignmentModule } from '@components/device-assignment/device-assignment.module';
import { DeviceModule } from '@components/device/device.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaintenancePeriodWarningSchema } from 'src/models/maintenance-period-warning/maintenance-period-warning.schema';
import { DeviceAssignmentRepository } from 'src/repository/device-assignment/device-assignment.repository';
import { DeviceRepository } from 'src/repository/device/device.repository';
import { MaintenancePeriodWarningRepository } from 'src/repository/maintenance-period-warning/maintenance-period-warning.repository';
import { MaintenancePeriodWarningController } from './maintenance-period-warning.controller';
import { MaintenancePeriodWarningService } from './maintenance-period-warning.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'MaintenancePeriodWarning',
        schema: MaintenancePeriodWarningSchema,
      },
    ]),
    forwardRef(() => DeviceModule),
    forwardRef(() => DeviceAssignmentModule),
  ],
  controllers: [MaintenancePeriodWarningController],
  providers: [
    {
      provide: 'MaintenancePeriodWarningRepositoryInterface',
      useClass: MaintenancePeriodWarningRepository,
    },
    {
      provide: 'MaintenancePeriodWarningServiceInterface',
      useClass: MaintenancePeriodWarningService,
    },
    {
      provide: 'DeviceAssignmentRepositoryInterface',
      useClass: DeviceAssignmentRepository,
    },
  ],
  exports: [
    MongooseModule,
    {
      provide: 'MaintenancePeriodWarningServiceInterface',
      useClass: MaintenancePeriodWarningService,
    },
  ],
})
export class MaintenancePeriodWarningModule {}
