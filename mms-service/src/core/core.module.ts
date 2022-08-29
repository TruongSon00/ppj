import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionEnterceptor } from './interceptors/exception.interceptor';
// import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Module({
  providers: [
    // { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ExceptionEnterceptor },
  ],
})
export class CoreModule {}
