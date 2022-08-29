import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectService } from '@nestcloud/service';
import { catchError, firstValueFrom, map, of, retry } from 'rxjs';
import { genericRetryStrategy } from '@utils/rxjs-util';
import { MmsServiceInterface } from './interface/mms.service.interface';
import { isEmpty } from 'lodash';

@Injectable()
export class MmsService implements MmsServiceInterface {
  private httpConfig;
  private endpoint;
  constructor(
    private httpClientService: HttpService,
    @InjectService()
    private readonly service: any,
  ) {
    this.endpoint = '/api/v1/mms';
    this.httpConfig = {
      scalingDuration: 1000,
      excludedStatusCodes: [409],
      callInternalService: true,
      serviceName: 'mms-service',
    };
  }
  async listRegion(condition?: any): Promise<any> {
    const url = await this.generateUrlInternalService(
      this.httpConfig.serviceName,
      `${this.endpoint}/regions`,
    );
    const filterArray = [];
    if (condition && !isEmpty(condition)) {
      for (const key in condition) {
        switch (key) {
          case 'codes':
            if (condition.codes && !isEmpty(condition.codes)) {
              filterArray.push({
                column: 'codes',
                text: condition.codes,
              });
            }
        }
      }
    }
    const result = await firstValueFrom(
      this.httpClientService
        .get(url, {
          params: {
            filter: JSON.stringify(filterArray),
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
    return result.data.items;
  }
  async detailRegion(id: string): Promise<any> {
    const url = await this.generateUrlInternalService(
      this.httpConfig.serviceName,
      `${this.endpoint}/regions/${id}`,
    );
    const result = await firstValueFrom(
      this.httpClientService.get(url).pipe(
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
    return result.data;
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
