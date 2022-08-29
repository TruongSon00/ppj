import { DeviceRepository } from 'src/repository/device/device.repository';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '@components/user/user.module';
import { CheckListTemplateController } from '@components/checklist-template/checklist-template.controller';
import { CheckListTemplateRepository } from 'src/repository/checklist-template/checklist-template.repository';
import { CheckListTemplateService } from '@components/checklist-template/checklist-template.service';
import { DeviceModule } from '@components/device/device.module';
import { HistoryModule } from '@components/history/history.module';
import { ChecklistTemplateSchema } from 'src/models/checklist-template/checklist-template.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'CheckListTemplate', schema: ChecklistTemplateSchema },
    ]),
    UserModule,
    forwardRef(() => DeviceModule),
    HistoryModule,
  ],
  controllers: [CheckListTemplateController],
  providers: [
    {
      provide: 'CheckListTemplateRepositoryInterface',
      useClass: CheckListTemplateRepository,
    },
    {
      provide: 'CheckListTemplateServiceInterface',
      useClass: CheckListTemplateService,
    },
    {
      provide: 'DeviceRepositoryInterface',
      useClass: DeviceRepository,
    },
  ],
  exports: [MongooseModule],
})
export class CheckListTemplateModule {}
