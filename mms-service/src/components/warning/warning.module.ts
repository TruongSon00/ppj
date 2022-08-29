import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WarningSchema } from 'src/models/warning/warning.schema';
import { WarningRepository } from 'src/repository/warning/warning.repository';
import { WarningController } from './warning.controller';
import { WarningService } from './warning.service';
import { DefectModule } from '../defect/defect.module';
import { DeviceAssignmentModule } from '../device-assignment/device-assignment.module';
import { DeviceAssignmentService } from '../device-assignment/device-assignment.service';
import { DeviceAssignmentRepository } from '../../repository/device-assignment/device-assignment.repository';
import { UserModule } from '@components/user/user.module';
import { UserService } from '@components/user/user.service';
import { DeviceRepository } from 'src/repository/device/device.repository';
import { DeviceModule } from '@components/device/device.module';
import { MaintainRequestRepository } from 'src/repository/maintain-request/maintain-request.repository';
import { MaintainRequestModule } from '@components/maintain-request/maintain-request.module';
import { DeviceRequestTicketRepository } from 'src/repository/device-request-ticket/device-request-ticket.repository';
import { DeviceRequestModule } from '@components/device-request/device-request.module';
import { MaintenanceTeamRepository } from 'src/repository/maintenance-team/maintenance-team.repository';
import { JobModule } from '@components/job/job.module';
import { AttributeTypeModule } from '@components/attribute-type/attribute-type.module';
import { SupplyModule } from '@components/supply/supply.module';
import { UnitModule } from '@components/unit/unit.module';
import { UnitRepository } from 'src/repository/unit/unit.repository';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Warning', schema: WarningSchema }]),
    DefectModule,
    forwardRef(() => DeviceAssignmentModule),
    UserModule,
    forwardRef(() => DeviceModule),
    forwardRef(() => MaintainRequestModule),
    forwardRef(() => DeviceRequestModule),
    forwardRef(() => JobModule),
    AttributeTypeModule,
    forwardRef(() => SupplyModule),
    UnitModule,
  ],
  controllers: [WarningController],
  providers: [
    {
      provide: 'WarningRepositoryInterface',
      useClass: WarningRepository,
    },
    {
      provide: 'WarningServiceInterface',
      useClass: WarningService,
    },
    {
      provide: 'DeviceAssignmentServiceInterface',
      useClass: DeviceAssignmentService,
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
      provide: 'WarningRepositoryInterface',
      useClass: WarningRepository,
    },
  ],
})
export class WarningModule {}
