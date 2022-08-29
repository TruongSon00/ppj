import { HttpClientService } from '@core/components/http-client/http-client.service';
import { Boot, InjectBoot } from '@nestcloud/boot';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { genericRetryStrategy } from '@utils/rxjs-util';
import { firstValueFrom, map, retry, catchError, of } from 'rxjs';
import { UserServiceInterface } from './interface/user.service.interface';

@Injectable()
export class UserService implements UserServiceInterface {
  private httpConfig;
  private endpoint;
  constructor(
    @InjectBoot() private readonly boot: Boot,
    private httpClientService: HttpClientService,

    private httpService: HttpService,
  ) {
    this.endpoint = '/api/v1/users';
    this.httpConfig = {
      scalingDuration: 500,
      maxRetryAttempts: 1,
      excludedStatusCodes: [409, 500],
      callInternalService: true,
      serviceName: 'user-service',
    };
  }
  async getDetail(id: any, accessToken: string): Promise<any> {
    const url = await this.httpClientService.generateUrlInternalService(
      this.httpConfig.serviceName,
      `${this.endpoint}/${id}`,
    );
    this.httpService.axiosRef.defaults.headers.common['authorization'] =
      accessToken;
    const response = await firstValueFrom(
      this.httpService.get(url, {}).pipe(
        map((response) => response.data),
        retry(genericRetryStrategy(this.httpConfig)),
        catchError((error) => of(error)),
      ),
    );

    return response.data;
  }
}
