import { getIPAddress } from '@utils/os.util';
import { HttpClientService } from '@core/components/http-client/http-client.service';
import { Boot, InjectBoot } from '@nestcloud/boot';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { KongGatewayServiceInterface } from './interface/kong-gateway.service.interface';

@Injectable()
export class KongGatewayService
  implements KongGatewayServiceInterface, OnModuleInit
{
  private host: string;
  private port: string;
  private upstreamName: string;
  private serviceName: string;
  private serviceHost: string;
  private servicePort: string;
  private apiPath: string;

  constructor(
    @InjectBoot() private readonly boot: Boot,
    private httpClientService: HttpClientService,
  ) {
    this.host = this.boot.get('kong.host') || 'localhost';
    this.port = this.boot.get('kong.port') || '8001';
    this.upstreamName = this.boot.get('kong.upstream.name') || '';
    this.serviceHost = getIPAddress();
    this.servicePort = this.boot.get('service.port') || '';
    this.apiPath = this.boot.get('service.apiPath') || '';
    this.serviceName = this.boot.get('service.name') || '';
  }

  onModuleInit() {
    return this.init();
  }

  async init(): Promise<any> {
    const serviceOptions = this.boot.get('service');
    const upstreams = await this.createOrUpdateUpStream();
    const upstreamTargets = await this.createOrUpdateUpStreamTarget();
    const service = await this.createOrUpdateService();
    const route = await this.createOrUpdateRoute();
  }

  async createOrUpdateService(): Promise<any> {
    return await this.httpClientService.put(
      `${this.host}:${this.port}/services/${this.upstreamName}`,
      {
        name: this.upstreamName,
        protocol: 'http',
        host: this.upstreamName,
        port: 80,
        path: '/',
      },
      {
        scalingDuration: 1000,
        excludedStatusCodes: [409],
      },
    );
  }

  async createOrUpdateRoute(): Promise<any> {
    return await this.httpClientService.put(
      `${this.host}:${this.port}/services/${this.upstreamName}/routes/${this.serviceName}`,
      {
        name: this.serviceName,
        protocols: ['http', 'https'],
        paths: [this.apiPath],
        strip_path: false,
      },
      {
        scalingDuration: 1000,
        excludedStatusCodes: [409],
      },
    );
  }

  async createOrUpdateUpStream(): Promise<any> {
    return await this.httpClientService.put(
      `${this.host}:${this.port}/upstreams/${this.upstreamName}`,
      {
        name: this.upstreamName,
      },
      {
        scalingDuration: 1000,
        excludedStatusCodes: [409],
      },
    );
  }

  async createOrUpdateUpStreamTarget(): Promise<any> {
    return await this.httpClientService.post(
      `${this.host}:${this.port}/upstreams/${this.upstreamName}/targets`,
      {
        target: `${this.serviceHost}:${this.servicePort}`,
      },
      {
        scalingDuration: 1000,
        excludedStatusCodes: [409],
      },
    );
  }
}
