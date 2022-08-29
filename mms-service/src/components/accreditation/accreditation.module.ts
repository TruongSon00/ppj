import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccreditationSchema } from 'src/models/accreditation/accreditation.schema';
import { AccreditationRepository } from 'src/repository/accreditation/accreditationRepository';
import { AccreditationController } from './accreditation.controller';
import { AccreditationService } from './accreditation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Accreditation', schema: AccreditationSchema },
    ]),
  ],
  controllers: [AccreditationController],
  providers: [
    { provide: 'IAccreditationRepository', useClass: AccreditationRepository },
    { provide: 'IAccreditationService', useClass: AccreditationService },
  ],
  exports: [
    MongooseModule,
    { provide: 'IAccreditationRepository', useClass: AccreditationRepository },
    { provide: 'IAccreditationService', useClass: AccreditationService },
  ],
})
export class AccreditationModule {}
