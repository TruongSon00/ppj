import { InterRegionModule } from '@components/inter-region/inter-region.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegionSchema } from 'src/models/region/region.schema';
import { InterRegionRepository } from 'src/repository/inter-region/inter-region.repository';
import { RegionRepository } from 'src/repository/region/region.repository';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'RegionModel', schema: RegionSchema }]),
    InterRegionModule,
  ],
  controllers: [RegionController],
  providers: [
    {
      provide: 'RegionRepositoryInterface',
      useClass: RegionRepository,
    },
    {
      provide: 'RegionServiceInterface',
      useClass: RegionService,
    },
    {
      provide: 'InterRegionRepositoryInterface',
      useClass: InterRegionRepository,
    },
  ],
  exports: [
    MongooseModule,
    {
      provide: 'RegionRepositoryInterface',
      useClass: RegionRepository,
    },
    {
      provide: 'RegionServiceInterface',
      useClass: RegionService,
    },
  ],
})
export class RegionModule {}
