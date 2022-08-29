import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceStatusService } from './device-status.service';
import { DeviceStatusRepository } from '../../repository/device-status/device-status.repository';
import { DeviceStatusSchema } from '../../models/device-status/device-status.schema';
import { DeviceStatusController } from './device-status.controller';
import { ProduceService } from '@components/produce/produce.service';
import { UserModule } from '@components/user/user.module';
import { DeviceAssignmentRepository } from 'src/repository/device-assignment/device-assignment.repository';
import { DeviceAssignmentSchema } from 'src/models/device-assignment/device-assignment.schema';
import { DeviceAssignmentService } from '@components/device-assignment/device-assignment.service';
import { DeviceAssignmentModule } from '@components/device-assignment/device-assignment.module';
import { DeviceRepository } from 'src/repository/device/device.repository';
import { DeviceModule } from '@components/device/device.module';
import { DeviceRequestTicketRepository } from 'src/repository/device-request-ticket/device-request-ticket.repository';
import { DeviceRequestModule } from '@components/device-request/device-request.module';
import { MaintainRequestModule } from '@components/maintain-request/maintain-request.module';
import { MaintainRequestRepository } from 'src/repository/maintain-request/maintain-request.repository';
import { MaintenanceTeamRepository } from 'src/repository/maintenance-team/maintenance-team.repository';
import { AttributeTypeRepository } from 'src/repository/attribute-type/attribute-type.repository';
import { AttributeTypeModule } from '@components/attribute-type/attribute-type.module';
import { SupplyModule } from '@components/supply/supply.module';
import { JobModule } from '@components/job/job.module';
import { UnitRepository } from 'src/repository/unit/unit.repository';
import { UnitModule } from '@components/unit/unit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DeviceStatus', schema: DeviceStatusSchema },
      { name: 'DeviceAssignment', schema: DeviceAssignmentSchema },
    ]),
    UserModule,
    DeviceModule,
    DeviceRequestModule,
    DeviceAssignmentModule,
    MaintainRequestModule,
    AttributeTypeModule,
    forwardRef(() => SupplyModule),
    JobModule,
    UnitModule,
  ],
  controllers: [DeviceStatusController],
  providers: [
    {
      provide: 'DeviceStatusRepositoryInterface',
      useClass: DeviceStatusRepository,
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
      provide: 'DeviceRequestTicketRepositoryInterface',
      useClass: DeviceRequestTicketRepository,
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
      provide: 'DeviceStatusServiceInterface',
      useClass: DeviceStatusService,
    },
    {
      provide: 'DeviceAssignmentServiceInterface',
      useClass: DeviceAssignmentService,
    },
    {
      provide: 'ProduceServiceInterface',
      useClass: ProduceService,
    },
    {
      provide: 'AttributeTypeRepositoryInterface',
      useClass: AttributeTypeRepository,
    },
    {
      provide: 'UnitRepositoryInterface',
      useClass: UnitRepository,
    },
  ],
  exports: [
    MongooseModule,
    {
      provide: 'DeviceStatusServiceInterface',
      useClass: DeviceStatusService,
    },
  ],
})
export class DeviceStatusModule {}
