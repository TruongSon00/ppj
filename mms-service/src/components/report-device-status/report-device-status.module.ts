import { DeviceAssignmentModule } from '@components/device-assignment/device-assignment.module';
import { MaintenancePeriodWarningModule } from '@components/maintenance-period-warning/maintenance-period-warning.module';
import { JobModule } from '@components/job/job.module';
import { MaintainRequestModule } from '@components/maintain-request/maintain-request.module';
import { DeviceModule } from '@components/device/device.module';
import { UserService } from '@components/user/user.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeviceAssignmentRepository } from 'src/repository/device-assignment/device-assignment.repository';
import { DeviceRepository } from 'src/repository/device/device.repository';
import { MaintenancePeriodWarningRepository } from 'src/repository/maintenance-period-warning/maintenance-period-warning.repository';
import { ReportDeviceStatusController } from './report-device-status.controller';
import { ReportDeviceStatusService } from './report-device-status.service';
import { MaintainRequestRepository } from 'src/repository/maintain-request/maintain-request.repository';
import { JobRepository } from 'src/repository/job/job.repository';
import { WarningModule } from '@components/warning/warning.module';
import { WarningRepository } from 'src/repository/warning/warning.repository';

@Module({
  imports: [
    ConfigModule,
    DeviceModule,
    DeviceAssignmentModule,
    WarningModule,
    MaintainRequestModule,
    JobModule,
  ],
  controllers: [ReportDeviceStatusController],
  providers: [
    {
      provide: 'ReportDeviceStatusServiceInterface',
      useClass: ReportDeviceStatusService,
    },
    {
      provide: 'DeviceRepositoryInterface',
      useClass: DeviceRepository,
    },
    {
      provide: 'DeviceAssignmentRepositoryInterface',
      useClass: DeviceAssignmentRepository,
    },
    {
      provide: 'WarningRepositoryInterface',
      useClass: WarningRepository,
    },
    {
      provide: 'MaintainRequestRepositoryInterface',
      useClass: MaintainRequestRepository,
    },
    {
      provide: 'JobRepositoryInterface',
      useClass: JobRepository,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
  ],
  exports: [],
})
export class ReportDeviceStatusModule {}
