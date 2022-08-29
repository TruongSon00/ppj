import { MongooseModule } from '@nestjs/mongoose';
import { MaintenanceTeamSchema } from 'src/models/maintenance-team/maintenance-team.schema';
import { Module } from '@nestjs/common';
import { MaintenanceTeamController } from '@components/maintenance-team/maintenance-team.controller';
import { MaintenanceTeamRepository } from 'src/repository/maintenance-team/maintenance-team.repository';
import { MaintenanceTeamService } from '@components/maintenance-team/maintenance-team.service';
import { UserModule } from '@components/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MaintenanceTeam', schema: MaintenanceTeamSchema },
    ]),
    UserModule,
  ],
  controllers: [MaintenanceTeamController],
  providers: [
    {
      provide: 'MaintenanceTeamRepositoryInterface',
      useClass: MaintenanceTeamRepository,
    },
    {
      provide: 'MaintenanceTeamServiceInterface',
      useClass: MaintenanceTeamService,
    },
  ],
  exports: [
    {
      provide: 'MaintenanceTeamServiceInterface',
      useClass: MaintenanceTeamService,
    },
    {
      provide: 'MaintenanceTeamRepositoryInterface',
      useClass: MaintenanceTeamRepository,
    },
  ],
})
export class MaintenanceTeamModule {}
