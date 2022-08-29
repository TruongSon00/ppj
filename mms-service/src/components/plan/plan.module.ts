import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobRepository } from 'src/repository/job/job.repository';
import { PlanSchema } from 'src/models/plan/plan.schema';
import { PlanController } from './plan.controller';
import { JobModule } from '@components/job/job.module';
import { PlanRepository } from 'src/repository/plan/plan.repository';
import { PlanService } from './plan.service';
import { MaintenanceTeamRepository } from 'src/repository/maintenance-team/maintenance-team.repository';
import { MaintenanceTeamSchema } from 'src/models/maintenance-team/maintenance-team.schema';
import { DeviceAssignmentRepository } from 'src/repository/device-assignment/device-assignment.repository';
import { DeviceAssignmentModule } from '@components/device-assignment/device-assignment.module';
import { WarningRepository } from 'src/repository/warning/warning.repository';
import { WarningModule } from '@components/warning/warning.module';
import { GeneralMaintenanceParameterRepository } from 'src/repository/general-maintenance-parameter/general-maintenance-parameter.repository';
import { GeneralMaintenanceParameterModule } from '@components/general-maintenance-parameter/general-maintenance-parameter.module';
import { JobDraftRepository } from 'src/repository/job/job-draft.repository';
import { JobDraftSchema } from 'src/models/job/job-draft.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Plan', schema: PlanSchema },
      { name: 'MaintenanceTeam', schema: MaintenanceTeamSchema },
      { name: 'JobDraft', schema: JobDraftSchema },
    ]),
    forwardRef(() => JobModule),
    forwardRef(() => DeviceAssignmentModule),
    WarningModule,
    GeneralMaintenanceParameterModule,
  ],
  controllers: [PlanController],
  providers: [
    {
      provide: 'JobRepositoryInterface',
      useClass: JobRepository,
    },
    {
      provide: 'PlanRepositoryInterface',
      useClass: PlanRepository,
    },
    {
      provide: 'PlanServiceInterface',
      useClass: PlanService,
    },
    {
      provide: 'MaintenanceTeamRepositoryInterface',
      useClass: MaintenanceTeamRepository,
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
      provide: 'GeneralMaintenanceParameterRepositoryInterface',
      useClass: GeneralMaintenanceParameterRepository,
    },
    {
      provide: 'JobDraftRepositoryInterface',
      useClass: JobDraftRepository,
    },
  ],
  exports: [
    MongooseModule,
    {
      provide: 'PlanRepositoryInterface',
      useClass: PlanRepository,
    },
  ],
})
export class PlanModule {}
