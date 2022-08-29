import { Module } from '@nestjs/common';
import { UserModule } from '@components/user/user.module';
import { HistoryService } from '@components/history/history.service';

@Module({
  imports: [UserModule],
  providers: [
    {
      provide: 'HistoryServiceInterface',
      useClass: HistoryService,
    },
  ],
  exports: [
    UserModule,
    {
      provide: 'HistoryServiceInterface',
      useClass: HistoryService,
    },
  ],
})
export class HistoryModule {}
