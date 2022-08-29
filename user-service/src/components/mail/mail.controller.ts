import { Controller, Get, Inject, Req } from '@nestjs/common';
import { ResponseBuilder } from '@utils/response-builder';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { MailServiceInterface } from '@components/mail/interface/mail.service.interface';

@Controller('mails')
export class MailController {
  constructor(
    @Inject('MailServiceInterface')
    private readonly mailService: MailServiceInterface,
  ) {}

  // @MessagePattern('ping')
  @Get('ping')
  public async get(): Promise<any> {
    return new ResponseBuilder('PONG')
      .withCode(ResponseCodeEnum.SUCCESS)
      .build();
  }
}
