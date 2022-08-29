import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UnitSchema } from 'src/models/unit/unit.schema';
import { UnitRepository } from 'src/repository/unit/unit.repository';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'UnitModel', schema: UnitSchema }]),
  ],
  controllers: [UnitController],
  providers: [
    {
      provide: 'UnitRepositoryInterface',
      useClass: UnitRepository,
    },
    {
      provide: 'UnitServiceInterface',
      useClass: UnitService,
    },
  ],
  exports: [
    MongooseModule,
    {
      provide: 'UnitRepositoryInterface',
      useClass: UnitRepository,
    },
    {
      provide: 'UnitServiceInterface',
      useClass: UnitService,
    },
  ],
})
export class UnitModule {}
