import { ResponseCodeEnum } from '@constant/response-code.enum';
import { Injectable } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHealth(): any {
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('This is Auth-service')
      .build();
  }
}
