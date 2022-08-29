import { Public } from '@core/decorator/set-public.decorator';
import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ping')
  @MessagePattern('ping')
  async ping(): Promise<any> {
    return await this.appService.ping();
  }

  @Public()
  @Get('health')
  getHealth(): string {
    return this.appService.getHealth();
  }
}
