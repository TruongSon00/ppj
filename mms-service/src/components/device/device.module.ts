import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceController } from '@components/device/device.controller';
import { DeviceSchema } from '../../models/device/device.schema';
import { DeviceRepository } from '../../repository/device/device.repository';
import { DeviceService } from '@components/device/device.service';
import { HistoryModule } from '@components/history/history.module';
import { HistoryService } from '@components/history/history.service';
import { UserModule } from '@components/user/user.module';
import { MaintenanceAttributeModule } from '@components/maintenance-attribute/maintenance-attribute.module';
import { MaintenanceTeamModule } from '@components/maintenance-team/maintenance-team.module';
import { SupplyModule } from '@components/supply/supply.module';
import { ItemModule } from '@components/item/item.module';
import { JobRepository } from 'src/repository/job/job.repository';
import { JobModule } from '@components/job/job.module';
import { DeviceAssignmentRepository } from 'src/repository/device-assignment/device-assignment.repository';
import { DeviceAssignmentModule } from '@components/device-assignment/device-assignment.module';
import { DeviceRequestModule } from '@components/device-request/device-request.module';
import { MaintainRequestModule } from '@components/maintain-request/maintain-request.module';
import { MaintainRequestRepository } from '../../repository/maintain-request/maintain-request.repository';
import { DeviceGroupModule } from '@components/device-group/device-group.module';
import { CheckListTemplateModule } from '@components/checklist-template/checklist-template.module';
import { CheckListTemplateRepository } from 'src/repository/checklist-template/checklist-template.repository';
import { UnitModule } from '@components/unit/unit.module';
import { UnitRepository } from 'src/repository/unit/unit.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Device', schema: DeviceSchema }]),
    UserModule,
    HistoryModule,
    forwardRef(() => SupplyModule),
    ItemModule,
    MaintenanceAttributeModule,
    MaintenanceTeamModule,
    forwardRef(() => JobModule),
    forwardRef(() => DeviceAssignmentModule),
    forwardRef(() => DeviceRequestModule),
    forwardRef(() => MaintainRequestModule),
    DeviceGroupModule,
    forwardRef(() => CheckListTemplateModule),
    UnitModule,
  ],
  controllers: [DeviceController],
  providers: [
    {
      provide: 'HistoryServiceInterface',
      useClass: HistoryService,
    },
    {
      provide: 'DeviceRepositoryInterface',
      useClass: DeviceRepository,
    },
    {
      provide: 'DeviceServiceInterface',
      useClass: DeviceService,
    },
    {
      provide: 'JobRepositoryInterface',
      useClass: JobRepository,
    },
    {
      provide: 'DeviceAssignmentRepositoryInterface',
      useClass: DeviceAssignmentRepository,
    },
    {
      provide: 'MaintainRequestRepositoryInterface',
      useClass: MaintainRequestRepository,
    },
    {
      provide: 'CheckListTemplateRepositoryInterface',
      useClass: CheckListTemplateRepository,
    },
    {
      provide: 'UnitRepositoryInterface',
      useClass: UnitRepository,
    },
  ],
  exports: [
    MongooseModule,
    {
      provide: 'DeviceRepositoryInterface',
      useClass: DeviceRepository,
    },
    {
      provide: 'DeviceServiceInterface',
      useClass: DeviceService,
    },
  ],
})
export class DeviceModule {}
