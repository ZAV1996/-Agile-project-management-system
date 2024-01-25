import { Module } from '@nestjs/common';
import { SmtpSendlerService } from './smtp-sendler.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { env } from 'process';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
@Module({
  imports: [MailerModule.forRoot({
    transport: {
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: false,
      tls: { rejectUnauthorized: false },
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD
      },
    },
    defaults: {
      from: "Пожалуйста не отвечайте на это письмо, оно сформировано автоматически."
    },
    template: {
      dir: join(__dirname, 'templates'),
      adapter: new HandlebarsAdapter()
    },
    options: {
      strict: true
    }
  })],
  providers: [SmtpSendlerService],
  exports: [SmtpSendlerService]
})
export class SmtpSendlerModule { }


