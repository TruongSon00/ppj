import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema } from 'src/models/job/job.schema';
import { JobRepository } from 'src/repository/job/job.repository';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { WarningRepository } from '../../repository/warning/warning.repository';
import { WarningModule } from '@components/warning/warning.module';
import { MaintainRequestRepository } from '../../repository/maintain-request/maintain-request.repository';
import { MaintainRequestModule } from '@components/maintain-request/maintain-request.module';
import { SupplyModule } from '@components/supply/supply.module';
import { SupplyRepository } from 'src/repository/supply/supply.repository';
import { MaintenanceTeamModule } from '@components/maintenance-team/maintenance-team.module';
import { DeviceAssignmentModule } from '@components/device-assignment/device-assignment.module';
import { DeviceRequestModule } from '@components/device-request/device-request.module';
import { PlanRepository } from 'src/repository/plan/plan.repository';
import { PlanModule } from '@components/plan/plan.module';
import { JobDraftRepository } from 'src/repository/job/job-draft.repository';
import { JobDraftSchema } from 'src/models/job/job-draft.schema';
import { UnitRepository } from 'src/repository/unit/unit.repository';
import { UnitModule } from '@components/unit/unit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Job', schema: JobSchema },
      { name: 'JobDraft', schema: JobDraftSchema },
    ]),
    forwardRef(() => WarningModule),
    forwardRef(() => MaintainRequestModule),
    forwardRef(() => SupplyModule),
    forwardRef(() => MaintenanceTeamModule),
    forwardRef(() => DeviceAssignmentModule),
    forwardRef(() => DeviceRequestModule),
    forwardRef(() => PlanModule),
    UnitModule,
  ],
  controllers: [JobController],
  providers: [
    {
      provide: 'JobRepositoryInterface',
      useClass: JobRepository,
    },
    {
      provide: 'JobServiceInterface',
      useClass: JobService,
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
      provide: 'SupplyRepositoryInterface',
      useClass: SupplyRepository,
    },
    {
      provide: 'PlanRepositoryInterface',
      useClass: PlanRepository,
    },
    {
      provide: 'JobDraftRepositoryInterface',
      useClass: JobDraftRepository,
    },
    {
      provide: 'UnitRepositoryInterface',
      useClass: UnitRepository,
    },
  ],
  exports: [
    MongooseModule,
    {
      provide: 'JobRepositoryInterface',
      useClass: JobRepository,
    },
  ],
})
export class JobModule {}
