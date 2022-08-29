import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceAssignmentSchema } from 'src/models/device-assignment/device-assignment.schema';
import { DeviceSchema } from 'src/models/device/device.schema';
import { JobSchema } from 'src/models/job/job.schema';
import { MaintainRequestSchema } from 'src/models/maintain-request/maintain-request.schema';
import { SupplySchema } from 'src/models/supply/supply.schema';
import { WarningSchema } from 'src/models/warning/warning.schema';
import { DeviceAssignmentRepository } from 'src/repository/device-assignment/device-assignment.repository';
import { DeviceRepository } from 'src/repository/device/device.repository';
import { JobRepository } from 'src/repository/job/job.repository';
import { MaintainRequestRepository } from 'src/repository/maintain-request/maintain-request.repository';
import { SupplyRepository } from 'src/repository/supply/supply.repository';
import { WarningRepository } from 'src/repository/warning/warning.repository';
import { DeviceAssignmentModule } from '@components/device-assignment/device-assignment.module';
import { CronController } from './cron.controller';
import { CronService } from './cron.service';
import { GeneralMaintenanceParameterModule } from '@components/general-maintenance-parameter/general-maintenance-parameter.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Warning', schema: WarningSchema },
      { name: 'DeviceAssignment', schema: DeviceAssignmentSchema },
      { name: 'Supply', schema: SupplySchema },
      { name: 'Job', schema: JobSchema },
      { name: 'MaintainRequest', schema: MaintainRequestSchema },
      { name: 'Device', schema: DeviceSchema },
    ]),
    forwardRef(() => DeviceAssignmentModule),
    forwardRef(() => GeneralMaintenanceParameterModule),
  ],
  controllers: [CronController],
  providers: [
    {
      provide: 'CronServiceInterface',
      useClass: CronService,
    },
    {
      provide: 'WarningRepositoryInterface',
      useClass: WarningRepository,
    },
    {
      provide: 'DeviceAssignmentRepositoryInterface',
      useClass: DeviceAssignmentRepository,
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
      provide: 'MaintainRequestRepositoryInterface',
      useClass: MaintainRequestRepository,
    },
    {
      provide: 'DeviceRepositoryInterface',
      useClass: DeviceRepository,
    },
  ],
  exports: [],
})
export class CronModule {}
