import { ResponsePayload } from '@utils/response-payload';
import { SendMailRequestDto } from '@components/mail/dto/request/send-mail.request.dto';

export interface MailServiceInterface {
  sendMail(request: SendMailRequestDto): Promise<ResponsePayload<any>>;
}
