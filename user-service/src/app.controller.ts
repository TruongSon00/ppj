import { Public } from '@core/decorator/set-public.decorator';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/')
export class AppController {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly appService: AppService) {}

  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  getHealth(): string {
    return this.appService.getHealth();
  }
}
