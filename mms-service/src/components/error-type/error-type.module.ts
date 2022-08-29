import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ErrorTypeSchema } from 'src/models/error-type/error-type.schema';
import { ErrorTypeRepository } from 'src/repository/error-type/error-type.repository';
import { ErrorTypeController } from './error-type.controller';
import { ErrorTypeService } from './error-type.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ErrorTypeModel', schema: ErrorTypeSchema },
    ]),
  ],
  controllers: [ErrorTypeController],
  providers: [
    {
      provide: 'ErrorTypeRepositoryInterface',
      useClass: ErrorTypeRepository,
    },
    {
      provide: 'ErrorTypeServiceInterface',
      useClass: ErrorTypeService,
    },
  ],
  exports: [
    MongooseModule,
    {
      provide: 'ErrorTypeRepositoryInterface',
      useClass: ErrorTypeRepository,
    },
    {
      provide: 'ErrorTypeServiceInterface',
      useClass: ErrorTypeService,
    },
  ],
})
export class ErrorTypeModule {}
