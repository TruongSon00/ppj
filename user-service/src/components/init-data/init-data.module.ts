import { Module } from '@nestjs/common';
import { InitDataController } from './init-data.controller';
import { InitDataService } from './init-data.service';
import { InitDataRepository } from '@repositories/init-data.repository';

@Module({
  imports: [],
  providers: [
    {
      provide: 'InitDataServiceInterface',
      useClass: InitDataService,
    },
    {
      provide: 'InitDataRepositoryInterface',
      useClass: InitDataRepository,
    },
  ],
  exports: [
    {
      provide: 'InitDataServiceInterface',
      useClass: InitDataService,
    },
    {
      provide: 'InitDataRepositoryInterface',
      useClass: InitDataRepository,
    },
  ],
  controllers: [InitDataController],
})
export class InitDataModule {}
