import { Controller, Get } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { AppService } from './app.service';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health(): any {
    return new ResponseBuilder({
      message: 'This is service 1'
    }).withCode(200).build();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
