import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../users/entities/user.entity';
import * as nodemailer from 'nodemailer'
import { env } from 'process';
import { use } from 'passport';
@Injectable()
export class SmtpSendlerService {
  constructor(private mailerService: MailerService) { }
  async mailTransport() {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: false,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
      from: env.SMTP_USER
    });
  }
  async sendUserConfirmation(user: User | null, token: string) {
    const url = `http://localhost:5000/api/auth/confirm?PER_NUM=${user?.PER_NUM}&token=${token}`;
    await this.mailerService.sendMail({
      to: user?.EMAIL,
      from: 'prj@uuap.com',
      subject: 'Активация учетной запись',
      template: './confirmation',
      context: {
        name: `${user?.FIRST_NAME + ' ' + user?.LAST_NAME}`,
        url,
      },
    });
  }

  async sendForgotPassword(user: User | null, token: string) {
    const url = `http://localhost:5000/api/auth/confirm?PER_NUM=${user?.PER_NUM}&token=${token}`;
    await this.mailerService.sendMail({
      to: user?.EMAIL,
      from: 'prj@uuap.com',
      subject: 'TODO',
      template: './confirmation',
      context: {
        name: `${user?.FIRST_NAME + ' ' + user?.LAST_NAME}`,
        url,
      },
    });
  }
}
