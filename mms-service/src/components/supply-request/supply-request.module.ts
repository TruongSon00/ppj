import { DeviceAssignmentModule } from '@components/device-assignment/device-assignment.module';
import { JobModule } from '@components/job/job.module';
import { SupplyModule } from '@components/supply/supply.module';
import { MaintenanceTeamModule } from '@components/maintenance-team/maintenance-team.module';
import { DeviceRequestModule } from '@components/device-request/device-request.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplyRequestSchema } from 'src/models/supply-request/supply-request.schema';
import { DeviceAssignmentRepository } from 'src/repository/device-assignment/device-assignment.repository';
import { JobRepository } from 'src/repository/job/job.repository';
import { SupplyRequestRepository } from 'src/repository/supply-request/supply-request.repository';
import { MaintenanceTeamRepository } from 'src/repository/maintenance-team/maintenance-team.repository';
import { SupplyRepository } from 'src/repository/supply/supply.repository';
import { SupplyRequestController } from './supply-request.controller';
import { SupplyRequestService } from './supply-request.service';
import { DeviceRequestTicketRepository } from 'src/repository/device-request-ticket/device-request-ticket.repository';
import { DeviceRepository } from 'src/repository/device/device.repository';
import { DeviceModule } from '@components/device/device.module';
import { UnitRepository } from 'src/repository/unit/unit.repository';
import { UnitModule } from '@components/unit/unit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'SupplyRequest', schema: SupplyRequestSchema },
    ]),
    SupplyModule,
    DeviceAssignmentModule,
    JobModule,
    MaintenanceTeamModule,
    DeviceRequestModule,
    DeviceModule,
    UnitModule,
  ],
  controllers: [SupplyRequestController],
  providers: [
    {
      provide: 'SupplyRequestRepositoryInterface',
      useClass: SupplyRequestRepository,
    },
    {
      provide: 'SupplyRequestServiceInterface',
      useClass: SupplyRequestService,
    },
    {
      provide: 'SupplyRepositoryInterface',
      useClass: SupplyRepository,
    },
    {
      provide: 'DeviceAssignmentRepositoryInterface',
      useClass: DeviceAssignmentRepository,
    },
    {
      provide: 'JobRepositoryInterface',
      useClass: JobRepository,
    },
    {
      provide: 'MaintenanceTeamRepositoryInterface',
      useClass: MaintenanceTeamRepository,
    },
    {
      provide: 'DeviceRequestTicketRepositoryInterface',
      useClass: DeviceRequestTicketRepository,
    },
    {
      provide: 'DeviceRepositoryInterface',
      useClass: DeviceRepository,
    },
    {
      provide: 'UnitRepositoryInterface',
      useClass: UnitRepository,
    },
  ],
  exports: [MongooseModule],
})
export class SupplyRequestModule {}
