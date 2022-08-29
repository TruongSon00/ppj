import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { genericRetryStrategy } from '@utils/rxjs-util';
import { catchError, firstValueFrom, map, of, retryWhen } from 'rxjs';
import { HttpClientServiceInterface } from './interface/http-client.service.interface';

@Injectable()
export class HttpClientService implements HttpClientServiceInterface {
  constructor(private httpService: HttpService) {}

  async generateUrlInternalService(
    serviceName: string,
    url: string,
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async get(url: string, params?: any, options?: any): Promise<any> {
    if (options && options.callInternalService === true) {
      url = await this.generateUrlInternalService(options.serviceName, url);
    }
    return await firstValueFrom(
      this.httpService.get(url, params).pipe(
        map((response) => response.data),
        retryWhen(genericRetryStrategy(options)),
        catchError((error) => of(error)),
      ),
    );
  }

  async post(url: string, body?: any, options?: any): Promise<any> {
    if (options && options.callInternalService === true) {
      url = this.generateUrlInternalService(url);
    }
    return await firstValueFrom(
      this.httpService.post(url, body).pipe(
        map((response) => response.data),
        retryWhen(genericRetryStrategy(options)),
        catchError((error) => of(error)),
      ),
    );
  }

  async put(url: string, body?: any, options?: any): Promise<any> {
    if (options && options.callInternalService === true) {
      url = this.generateUrlInternalService(url);
    }
    return await firstValueFrom(
      this.httpService.put(url, body).pipe(
        map((response) => response.data),
        retryWhen(genericRetryStrategy(options)),
        catchError((error) => of(error)),
      ),
    );
  }
  async delete(url: string, params?: any): Promise<any> {
    if (options && options.callInternalService === true) {
      url = this.generateUrlInternalService(url);
    }
    return await firstValueFrom(
      this.httpService.delete(url, params).pipe(
        map((response) => response.data),
        retryWhen(
          genericRetryStrategy({
            scalingDuration: 1000,
            excludedStatusCodes: [409],
          }),
        ),
        catchError((error) => of(error)),
      ),
    );
  }
}
