import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MmsService } from './mms.service';
import { MmsController } from './mms.controller';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: 'MmsServiceInterface',
      useClass: MmsService,
    },
  ],
  exports: [
    {
      provide: 'MmsServiceInterface',
      useClass: MmsService,
    },
  ],
  controllers: [MmsController],
})
export class MmsModule {}
