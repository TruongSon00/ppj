import { ExceptionEnterceptor } from '@core/interceptor/exception.interceptor';
import { LoggingInterceptor } from '@core/interceptor/logging.interceptor';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ExceptionEnterceptor },
  ],
})
export class CoreModule {}
