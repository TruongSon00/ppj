import { SupplyRepository } from 'src/repository/supply/supply.repository';
import { SupplyModule } from '@components/supply/supply.module';
import { DeviceRequestModule } from '@components/device-request/device-request.module';
import { DeviceModule } from '@components/device/device.module';
import { MaintainRequestModule } from '@components/maintain-request/maintain-request.module';
import { ProduceModule } from '@components/produce/produce.module';
import { MaintenanceTeamModule } from '@components/maintenance-team/maintenance-team.module';
import { ProduceService } from '@components/produce/produce.service';
import { UserService } from '@components/user/user.service';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceAssignmentSchema } from 'src/models/device-assignment/device-assignment.schema';
import { DeviceAssignmentRepository } from 'src/repository/device-assignment/device-assignment.repository';
import { DeviceRequestTicketRepository } from 'src/repository/device-request-ticket/device-request-ticket.repository';
import { DeviceRepository } from 'src/repository/device/device.repository';
import { MaintainRequestRepository } from 'src/repository/maintain-request/maintain-request.repository';
import { MaintenanceTeamRepository } from 'src/repository/maintenance-team/maintenance-team.repository';
import { DeviceAssignmentController } from './device-assignment.controller';
import { DeviceAssignmentService } from './device-assignment.service';
import { MaintenanceTeamSchema } from 'src/models/maintenance-team/maintenance-team.schema';
import { AttributeTypeModule } from '@components/attribute-type/attribute-type.module';
import { AttributeTypeRepository } from 'src/repository/attribute-type/attribute-type.repository';
import { SupplySchema } from 'src/models/supply/supply.schema';
import { JobRepository } from 'src/repository/job/job.repository';
import { JobModule } from '@components/job/job.module';
import { UnitModule } from '@components/unit/unit.module';
import { UnitRepository } from 'src/repository/unit/unit.repository';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DeviceAssignment', schema: DeviceAssignmentSchema },
      { name: 'MaintenanceTeam', schema: MaintenanceTeamSchema },
      { name: 'Supply', schema: SupplySchema },
    ]),
    forwardRef(() => MaintainRequestModule),
    forwardRef(() => DeviceModule),
    forwardRef(() => DeviceRequestModule),
    forwardRef(() => SupplyModule),
    AttributeTypeModule,
    ProduceModule,
    MaintenanceTeamModule,
    JobModule,
    UnitModule,
  ],
  controllers: [DeviceAssignmentController],
  providers: [
    {
      provide: 'DeviceAssignmentRepositoryInterface',
      useClass: DeviceAssignmentRepository,
    },
    {
      provide: 'DeviceAssignmentServiceInterface',
      useClass: DeviceAssignmentService,
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
      provide: 'DeviceRequestTicketRepositoryInterface',
      useClass: DeviceRequestTicketRepository,
    },
    {
      provide: 'MaintenanceTeamRepositoryInterface',
      useClass: MaintenanceTeamRepository,
    },
    {
      provide: 'AttributeTypeRepositoryInterface',
      useClass: AttributeTypeRepository,
    },
    {
      provide: 'SupplyRepositoryInterface',
      useClass: SupplyRepository,
    },
    {
      provide: 'JobRepositoryInterface',
      useClass: JobRepository,
    },
    {
      provide: 'ProduceServiceInterface',
      useClass: ProduceService,
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
      provide: 'DeviceAssignmentRepositoryInterface',
      useClass: DeviceAssignmentRepository,
    },
    {
      provide: 'DeviceAssignmentServiceInterface',
      useClass: DeviceAssignmentService,
    },
  ],
})
export class DeviceAssignmentModule {}
