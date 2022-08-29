import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InterRegionSchema } from 'src/models/inter-region/inter-region.schema';
import { InterRegionRepository } from 'src/repository/inter-region/inter-region.repository';
import { InterRegionController } from './inter-region.controller';
import { InterRegionService } from './inter-region.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'InterRegionModel', schema: InterRegionSchema },
    ]),
  ],
  controllers: [InterRegionController],
  providers: [
    {
      provide: 'InterRegionRepositoryInterface',
      useClass: InterRegionRepository,
    },
    {
      provide: 'InterRegionServiceInterface',
      useClass: InterRegionService,
    },
  ],
  exports: [
    MongooseModule,
    {
      provide: 'InterRegionRepositoryInterface',
      useClass: InterRegionRepository,
    },
    {
      provide: 'InterRegionServiceInterface',
      useClass: InterRegionService,
    },
  ],
})
export class InterRegionModule {}
