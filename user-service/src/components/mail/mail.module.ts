import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailService } from '@components/mail/mail.service';
import { join } from 'path';
import { MailConfig } from '@config/mail.config';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: new MailConfig().get('host'),
        port: new MailConfig().get('port'),
        secure: true,
        auth: {
          type: 'login',
          user: new MailConfig().get('username'),
          pass: new MailConfig().get('password'),
        },
      },
      defaults: {
        from: `"No Reply" <${new MailConfig().get('noReply')}>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
  ],
  exports: [MailService],
  providers: [MailService],
  controllers: [],
})
export class MailModule {}
