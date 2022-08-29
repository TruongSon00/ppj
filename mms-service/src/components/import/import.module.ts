import { Module } from '@nestjs/common';
import { ImportService } from '@components/import/import.service';

@Module({
  providers: [
    {
      provide: 'ImportServiceInterface',
      useClass: ImportService,
    },
  ],
  exports: [
    {
      provide: 'ImportServiceInterface',
      useClass: ImportService,
    },
  ],
})
export class ImportModule {}
