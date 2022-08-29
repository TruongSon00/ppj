import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorSchema } from 'src/models/vendor/vendor.schema';
import { VendorController } from './vendor.controller';
import { VendorRepository } from 'src/repository/vendor/vendor.repository';
import { VendorService } from './vendor.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'VendorModel', schema: VendorSchema }]),
  ],
  controllers: [VendorController],
  providers: [
    {
      provide: 'VendorRepositoryInterface',
      useClass: VendorRepository,
    },
    {
      provide: 'VendorServiceInterface',
      useClass: VendorService,
    },
  ],
  exports: [
    {
      provide: 'VendorRepositoryInterface',
      useClass: VendorRepository,
    },
    {
      provide: 'VendorServiceInterface',
      useClass: VendorService,
    },
  ],
})
export class VendorModule {}
