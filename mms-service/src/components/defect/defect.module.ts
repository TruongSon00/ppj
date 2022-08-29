import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DefectSchema } from 'src/models/defect/defect.schema';
import { DefectRepository } from 'src/repository/defect/defect.repository';
import { DefectController } from './defect.controller';
import { DefectService } from './defect.service';
import { UserModule } from '@components/user/user.module';
import { DeviceRepository } from '../../repository/device/device.repository';
import { DeviceSchema } from '../../models/device/device.schema';
import { HistoryModule } from '@components/history/history.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Defect', schema: DefectSchema },
      { name: 'Device', schema: DeviceSchema },
    ]),
    UserModule,
    HistoryModule,
  ],
  controllers: [DefectController],
  providers: [
    {
      provide: 'DefectRepositoryInterface',
      useClass: DefectRepository,
    },
    {
      provide: 'DefectServiceInterface',
      useClass: DefectService,
    },
    {
      provide: 'DeviceRepositoryInterface',
      useClass: DeviceRepository,
    },
  ],
  exports: [
    MongooseModule,
    {
      provide: 'DefectRepositoryInterface',
      useClass: DefectRepository,
    },
    {
      provide: 'DefectServiceInterface',
      useClass: DefectService,
    },
  ],
})
export class DefectModule {}
