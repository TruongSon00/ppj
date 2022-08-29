import { DeviceAssignmentModule } from '@components/device-assignment/device-assignment.module';
import { DeviceModule } from '@components/device/device.module';
import { ItemModule } from '@components/item/item.module';
import { JobModule } from '@components/job/job.module';
import { SupplyModule } from '@components/supply/supply.module';
import { MaintenanceTeamModule } from '@components/maintenance-team/maintenance-team.module';
import { DeviceRequestModule } from '@components/device-request/device-request.module';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaintainRequestSchema } from 'src/models/maintain-request/maintain-request.schema';
import { DeviceAssignmentRepository } from 'src/repository/device-assignment/device-assignment.repository';
import { DeviceRepository } from 'src/repository/device/device.repository';
import { JobRepository } from 'src/repository/job/job.repository';
import { MaintainRequestRepository } from 'src/repository/maintain-request/maintain-request.repository';
import { SupplyRepository } from 'src/repository/supply/supply.repository';
import { MaintainRequestController } from './maintain-request.controller';
import { MaintainRequestService } from './maintain-request.service';
import { UnitModule } from '@components/unit/unit.module';
import { UnitRepository } from 'src/repository/unit/unit.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MaintainRequest', schema: MaintainRequestSchema },
    ]),
    forwardRef(() => JobModule),
    forwardRef(() => SupplyModule),
    forwardRef(() => DeviceAssignmentModule),
    forwardRef(() => DeviceModule),
    forwardRef(() => ItemModule),
    forwardRef(() => MaintenanceTeamModule),
    forwardRef(() => DeviceRequestModule),
    UnitModule,
  ],
  controllers: [MaintainRequestController],
  providers: [
    {
      provide: 'MaintainRequestRepositoryInterface',
      useClass: MaintainRequestRepository,
    },
    {
      provide: 'JobRepositoryInterface',
      useClass: JobRepository,
    },
    {
      provide: 'MaintainRequestServiceInterface',
      useClass: MaintainRequestService,
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
      provide: 'DeviceRepositoryInterface',
      useClass: DeviceRepository,
    },
    {
      provide: 'UnitRepositoryInterface',
      useClass: UnitRepository,
    },
  ],
  exports: [
    MongooseModule,
    {
      provide: 'MaintainRequestRepositoryInterface',
      useClass: MaintainRequestRepository,
    },
    {
      provide: 'MaintainRequestServiceInterface',
      useClass: MaintainRequestService,
    },
  ],
})
export class MaintainRequestModule {}
