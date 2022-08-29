import { JobModule } from '@components/job/job.module';
import { MaintainRequestModule } from '@components/maintain-request/maintain-request.module';
import { MaintenanceTeamModule } from '@components/maintenance-team/maintenance-team.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MaintenanceTeamSchema } from 'src/models/maintenance-team/maintenance-team.schema';
import { JobRepository } from 'src/repository/job/job.repository';
import { MaintainRequestRepository } from 'src/repository/maintain-request/maintain-request.repository';
import { MaintenanceTeamRepository } from 'src/repository/maintenance-team/maintenance-team.repository';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MaintenanceTeam', schema: MaintenanceTeamSchema },
    ]),
    ConfigModule,
    JobModule,
    MaintainRequestModule,
    // MaintenanceTeamModule,
  ],
  controllers: [ReportController],
  providers: [
    {
      provide: 'ReportServiceInterface',
      useClass: ReportService,
    },
    {
      provide: 'JobRepositoryInterface',
      useClass: JobRepository,
    },
    {
      provide: 'MaintainRequestRepositoryInterface',
      useClass: MaintainRequestRepository,
    },
    {
      provide: 'MaintenanceTeamRepositoryInterface',
      useClass: MaintenanceTeamRepository,
    },
  ],
  exports: [],
})
export class ReportModule {}
