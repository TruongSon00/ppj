import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.getArgByIndex(0);

    if (request.url !== '/api/v1/mms/health') {
      console.log('Before...');
      console.log('url: ', request?.url);
      console.log('body: ', request?.body);
    }

    const now = Date.now();
    return next.handle().pipe(
      tap((data) => {
        if (request.url !== '/api/v1/mms/health') {
          console.log('Response: ', data);
          console.log(`After... ${Date.now() - now}ms`);
        }
      }),
    );
  }
}
