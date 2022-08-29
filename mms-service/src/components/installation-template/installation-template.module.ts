import { DeviceModule } from '@components/device/device.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstallationTemplateSchema } from 'src/models/installation-template/installation-template.schema';
import { DeviceRepository } from 'src/repository/device/device.repository';
import { InstallationTemplateRepository } from 'src/repository/installation-template/installation-template.repository';
import { InstallationTemplateController } from './installation-template.controller';
import { InstallationTemplateService } from './installation-template.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'InstallationTemplate', schema: InstallationTemplateSchema },
    ]),
    forwardRef(() => DeviceModule),
  ],
  controllers: [InstallationTemplateController],
  providers: [
    {
      provide: 'InstallationTemplateRepositoryInterface',
      useClass: InstallationTemplateRepository,
    },
    {
      provide: 'InstallationTemplateServiceInterface',
      useClass: InstallationTemplateService,
    },
    {
      provide: 'DeviceRepositoryInterface',
      useClass: DeviceRepository,
    }
  ],
  exports: [MongooseModule],
})
export class InstallationTemplateModule {}
