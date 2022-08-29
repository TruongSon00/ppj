import { Injectable } from '@nestjs/common';
import { MailServiceInterface } from '@components/mail/interface/mail.service.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { ResponsePayload } from '@utils/response-payload';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { ResponseBuilder } from '@utils/response-builder';
import { ApiError } from '@utils/api.error';
import { SendMailRequestDto } from '@components/mail/dto/request/send-mail.request.dto';
import { I18nRequestScopeService } from 'nestjs-i18n';

@Injectable()
export class MailService implements MailServiceInterface {
  constructor(
    private mailerService: MailerService,
    private readonly i18n: I18nRequestScopeService,
  ) {}

  public async sendMail(
    request: SendMailRequestDto,
  ): Promise<ResponsePayload<any>> {
    try {
      const { email, body } = request;
      await this.mailerService.sendMail({
        to: email,
        subject: body.subject,
        template: body.template,
        context: body.context,
      });
      return new ResponseBuilder().withCode(ResponseCodeEnum.SUCCESS).build();
    } catch (error) {
      console.log(error);
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        await this.i18n.translate('error.NOT_FOUND'),
      ).toResponse();
    }
  }
}
