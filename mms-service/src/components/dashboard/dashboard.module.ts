import { AttributeTypeModule } from '@components/attribute-type/attribute-type.module';
import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { JobModule } from '../job/job.module';
import { JobRepository } from 'src/repository/job/job.repository';
import { DeviceAssignmentRepository } from 'src/repository/device-assignment/device-assignment.repository';
import { DeviceAssignmentModule } from '../device-assignment/device-assignment.module';
import { WarningModule } from '@components/warning/warning.module';
import { WarningRepository } from 'src/repository/warning/warning.repository';
import { ProduceModule } from '@components/produce/produce.module';
import { ProduceService } from '@components/produce/produce.service';
import { DeviceStatusModule } from '@components/device-status/device-status.module';
import { DeviceStatusRepository } from 'src/repository/device-status/device-status.repository';
import { DeviceStatusService } from '@components/device-status/device-status.service';
import { MaintainRequestModule } from '@components/maintain-request/maintain-request.module';
import { MaintainRequestRepository } from 'src/repository/maintain-request/maintain-request.repository';
import { UnitRepository } from 'src/repository/unit/unit.repository';
import { UnitModule } from '@components/unit/unit.module';

@Module({
  imports: [
    JobModule,
    DeviceAssignmentModule,
    WarningModule,
    ProduceModule,
    DeviceStatusModule,
    AttributeTypeModule,
    MaintainRequestModule,
    UnitModule,
  ],
  controllers: [DashboardController],
  providers: [
    {
      provide: 'DashboardServiceInterface',
      useClass: DashboardService,
    },
    {
      provide: 'JobRepositoryInterface',
      useClass: JobRepository,
    },
    {
      provide: 'DeviceAssignmentRepositoryInterface',
      useClass: DeviceAssignmentRepository,
    },
    {
      provide: 'ProduceServiceInterface',
      useClass: ProduceService,
    },
    {
      provide: 'WarningRepositoryInterface',
      useClass: WarningRepository,
    },
    {
      provide: 'DeviceStatusRepositoryInterface',
      useClass: DeviceStatusRepository,
    },
    {
      provide: 'DeviceStatusServiceInterface',
      useClass: DeviceStatusService,
    },
    {
      provide: 'MaintainRequestRepositoryInterface',
      useClass: MaintainRequestRepository,
    },
    {
      provide: 'UnitRepositoryInterface',
      useClass: UnitRepository,
    },
  ],
})
export class DashboardModule {}
