import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplyController } from './supply.controller';
import { SupplyService } from './supply.service';
import { DeviceAssignmentModule } from '../device-assignment/device-assignment.module';
import { DeviceAssignmentService } from '../device-assignment/device-assignment.service';
import { DeviceAssignmentRepository } from '../../repository/device-assignment/device-assignment.repository';
import { UserModule } from '@components/user/user.module';
import { UserService } from '@components/user/user.service';
import { SupplyRepository } from '../../repository/supply/supply.repository';
import { SupplySchema } from '../../models/supply/supply.schema';
import { SupplyGroupModule } from '@components/supply-group/supply-group.module';
import { MaintenanceTeamModule } from '@components/maintenance-team/maintenance-team.module';
import { HistoryModule } from '@components/history/history.module';
import { DeviceRepository } from 'src/repository/device/device.repository';
import { DeviceModule } from '@components/device/device.module';
import { MaintainRequestRepository } from 'src/repository/maintain-request/maintain-request.repository';
import { MaintainRequestModule } from '@components/maintain-request/maintain-request.module';
import { MaintenanceTeamRepository } from 'src/repository/maintenance-team/maintenance-team.repository';
import { HistoryService } from '@components/history/history.service';
import { MaintenanceTeamSchema } from 'src/models/maintenance-team/maintenance-team.schema';
import { DeviceRequestTicketRepository } from 'src/repository/device-request-ticket/device-request-ticket.repository';
import { DeviceRequestModule } from '@components/device-request/device-request.module';
import { AttributeTypeModule } from '@components/attribute-type/attribute-type.module';
import { JobModule } from '@components/job/job.module';
import { UnitModule } from '@components/unit/unit.module';
import { UnitRepository } from 'src/repository/unit/unit.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Supply', schema: SupplySchema },
      { name: 'MaintenanceTeam', schema: MaintenanceTeamSchema },
    ]),
    forwardRef(() => DeviceAssignmentModule),
    forwardRef(() => DeviceModule),
    forwardRef(() => MaintainRequestModule),
    forwardRef(() => MaintenanceTeamModule),
    forwardRef(() => DeviceRequestModule),
    UserModule,
    SupplyGroupModule,
    HistoryModule,
    AttributeTypeModule,
    JobModule,
    UnitModule,
  ],
  controllers: [SupplyController],
  providers: [
    {
      provide: 'SupplyServiceInterface',
      useClass: SupplyService,
    },
    {
      provide: 'SupplyRepositoryInterface',
      useClass: SupplyRepository,
    },
    {
      provide: 'DeviceAssignmentServiceInterface',
      useClass: DeviceAssignmentService,
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
      provide: 'MaintainRequestRepositoryInterface',
      useClass: MaintainRequestRepository,
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
      provide: 'HistoryServiceInterface',
      useClass: HistoryService,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'UnitRepositoryInterface',
      useClass: UnitRepository,
    },
  ],
  exports: [
    MongooseModule,
    {
      provide: 'SupplyServiceInterface',
      useClass: SupplyService,
    },
    {
      provide: 'SupplyRepositoryInterface',
      useClass: SupplyRepository,
    },
  ],
})
export class SupplyModule {}
