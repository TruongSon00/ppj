import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GeneralMaintenanceParameterSchema } from '../../models/general-maintenance-parameter/general-maintenance-parameter.schema';
import { GeneralMaintenanceParameterController } from '@components/general-maintenance-parameter/general-maintenance-parameter.controller';
import { GeneralMaintenanceParameterService } from '@components/general-maintenance-parameter/general-maintenance-parameter.service';
import { GeneralMaintenanceParameterRepository } from '../../repository/general-maintenance-parameter/general-maintenance-parameter.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'GeneralMaintenanceParameter',
        schema: GeneralMaintenanceParameterSchema,
      },
    ]),
  ],
  controllers: [GeneralMaintenanceParameterController],
  providers: [
    {
      provide: 'GeneralMaintenanceParameterServiceInterface',
      useClass: GeneralMaintenanceParameterService,
    },
    {
      provide: 'GeneralMaintenanceParameterRepositoryInterface',
      useClass: GeneralMaintenanceParameterRepository,
    },
  ],
  exports: [
    MongooseModule,
    {
      provide: 'GeneralMaintenanceParameterServiceInterface',
      useClass: GeneralMaintenanceParameterService,
    },
    {
      provide: 'GeneralMaintenanceParameterRepositoryInterface',
      useClass: GeneralMaintenanceParameterRepository,
    },
  ],
})
export class GeneralMaintenanceParameterModule {}
