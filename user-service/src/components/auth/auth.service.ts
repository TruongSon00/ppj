import { Injectable } from '@nestjs/common';
import { AuthServiceInterface } from '@components/auth/interface/auth.service.interface';
import { HttpService } from '@nestjs/axios';
import { InjectService } from '@nestcloud/service';
import { catchError, firstValueFrom, map, of, retry } from 'rxjs';
import { genericRetryStrategy } from '@utils/rxjs-util';

@Injectable()
export class AuthService implements AuthServiceInterface {
  private httpConfig;
  private endpoint;
  constructor(
    private httpClientService: HttpService,
    @InjectService()
    private readonly service: any,
  ) {
    this.endpoint = '/api/v1/auth';
    this.httpConfig = {
      scalingDuration: 1000,
      excludedStatusCodes: [409],
      callInternalService: true,
      serviceName: 'auth-service',
    };
  }

  async generateUrlInternalService(
    serviceName: string,
    url: string,
  ): Promise<string> {
    const servers = this.service.getServiceServers(serviceName, {
      passing: true,
    });

    const server = servers[Math.floor(Math.random() * servers.length)];

    return `http://${server.address}:${server.port}${url}`;
  }

  async validateToken(token: string, permissionCode: string): Promise<any> {
    this.httpClientService.axiosRef.defaults.headers.common[
      'authorization'
    ] = `${token}`;
    const url = await this.generateUrlInternalService(
      this.httpConfig.serviceName,
      `${this.endpoint}/token/validate`,
    );

    return await firstValueFrom(
      this.httpClientService
        .get(url, {
          params: {
            permissionCode: permissionCode,
          },
        })
        .pipe(
          map((response) => response.data),
          retry(
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
