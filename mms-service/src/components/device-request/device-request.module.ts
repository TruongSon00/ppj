import { DeviceGroupModule } from '@components/device-group/device-group.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '@components/user/user.module';
import { SupplyModule } from '@components/supply/supply.module';
import { DeviceRequestService } from '@components/device-request/device-request.service';
import { DeviceRequestTicketRepository } from '../../repository/device-request-ticket/device-request-ticket.repository';
import { DeviceRequestTicketSchema } from '../../models/device-request-ticket/device-request-ticket.schema';
import { DeviceModule } from '@components/device/device.module';
import { DeviceRequestController } from '@components/device-request/device-request.controller';
import { DeviceAssignmentService } from '@components/device-assignment/device-assignment.service';
import { DeviceAssignmentModule } from '@components/device-assignment/device-assignment.module';
import { MaintainRequestModule } from '@components/maintain-request/maintain-request.module';
import { MaintenanceTeamModule } from '@components/maintenance-team/maintenance-team.module';
import { DeviceRepository } from 'src/repository/device/device.repository';
import { AttributeTypeModule } from '@components/attribute-type/attribute-type.module';
import { DeviceAssignmentRepository } from 'src/repository/device-assignment/device-assignment.repository';
import { JobModule } from '@components/job/job.module';
import { UnitRepository } from 'src/repository/unit/unit.repository';
import { UnitModule } from '@components/unit/unit.module';
import { DeviceGroupRepository } from 'src/repository/device-group/device-group.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DeviceRequestTicket', schema: DeviceRequestTicketSchema },
    ]),
    UserModule,
    MaintenanceTeamModule,
    forwardRef(() => DeviceAssignmentModule),
    forwardRef(() => DeviceModule),
    forwardRef(() => MaintainRequestModule),
    forwardRef(() => SupplyModule),
    AttributeTypeModule,
    DeviceGroupModule,
    forwardRef(() => JobModule),
    UnitModule,
  ],
  controllers: [DeviceRequestController],
  providers: [
    {
      provide: 'DeviceRequestTicketRepositoryInterface',
      useClass: DeviceRequestTicketRepository,
    },
    {
      provide: 'DeviceRequestServiceInterface',
      useClass: DeviceRequestService,
    },
    {
      provide: 'DeviceAssignmentServiceInterface',
      useClass: DeviceAssignmentService,
    },
    {
      provide: 'DeviceGroupRepositoryInterface',
      useClass: DeviceGroupRepository,
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
      provide: 'DeviceRequestServiceInterface',
      useClass: DeviceRequestService,
    },
    {
      provide: 'DeviceRequestTicketRepositoryInterface',
      useClass: DeviceRequestTicketRepository,
    },
  ],
})
export class DeviceRequestModule {}
