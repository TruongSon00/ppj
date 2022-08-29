import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { MaintenanceAttributeSchema } from '../../models/maintenance-attribute/maintenance-attribute.schema';
import { UserModule } from '@components/user/user.module';
import { MaintenanceAttributeController } from '@components/maintenance-attribute/maintenance-attribute.controller';
import { MaintenanceAttributeRepository } from '../../repository/maintenance-attribute/maintenance-attribute.repository';
import { MaintenanceAttributeService } from '@components/maintenance-attribute/maintenance-attribute.service';
import { HistoryModule } from '@components/history/history.module';
import { DeviceModule } from '@components/device/device.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MaintenanceAttribute', schema: MaintenanceAttributeSchema },
    ]),
    UserModule,
    HistoryModule,
    forwardRef(() => DeviceModule),
  ],
  controllers: [MaintenanceAttributeController],
  providers: [
    {
      provide: 'MaintenanceAttributeRepositoryInterface',
      useClass: MaintenanceAttributeRepository,
    },
    {
      provide: 'MaintenanceAttributeServiceInterface',
      useClass: MaintenanceAttributeService,
    },
  ],
  exports: [
    {
      provide: 'MaintenanceAttributeRepositoryInterface',
      useClass: MaintenanceAttributeRepository,
    },
    {
      provide: 'MaintenanceAttributeServiceInterface',
      useClass: MaintenanceAttributeService,
    },
  ]
})
export class MaintenanceAttributeModule {}
