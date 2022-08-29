import { UnitSchema } from 'src/models/unit/unit.schema';
import { UnitModule } from '@components/unit/unit.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttributeTypeSchema } from 'src/models/attribute-type/attribute-type.schema';
import { AttributeTypeRepository } from 'src/repository/attribute-type/attribute-type.repository';
import { UnitRepository } from 'src/repository/unit/unit.repository';
import { AttributeTypeController } from './attribute-type.controller';
import { AttributeTypeService } from './attribute-type.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AttributeType', schema: AttributeTypeSchema },
      { name: 'UnitModel', schema: UnitSchema },
    ]),
    UnitModule,
  ],
  controllers: [AttributeTypeController],
  providers: [
    {
      provide: 'AttributeTypeRepositoryInterface',
      useClass: AttributeTypeRepository,
    },
    {
      provide: 'AttributeTypeServiceInterface',
      useClass: AttributeTypeService,
    },
    {
      provide: 'UnitRepositoryInterface',
      useClass: UnitRepository,
    },
  ],
  exports: [
    MongooseModule,
    {
      provide: 'AttributeTypeRepositoryInterface',
      useClass: AttributeTypeRepository,
    },
    {
      provide: 'AttributeTypeServiceInterface',
      useClass: AttributeTypeService,
    },
  ],
})
export class AttributeTypeModule {}
