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
    const url = `${env.ORIGIN}/api/auth/confirm?PER_NUM=${user?.PER_NUM}&token=${token}`;

    await this.mailerService.sendMail({
      to: user?.EMAIL,
      from: 'prj@uuap.com', // override default from
      subject: 'Активация учетной запись',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: `${user?.FIRST_NAME + ' ' + user?.LAST_NAME}`,
        url,
      },
    });
  }

  async sendForgotPassword(user: User | null, token: string) {

    // const transport = await this.mailTransport();
    // transport.sendMail({
    //   subject: "Восстановление пароля",
    //   html: `
    //   <div>

    //   </div>`
    // })






    // let result = await transporter.sendMail({
    //   to: 'zav20570@uuap.com',
    //   subject: 'Message from Node js',
    //   text: 'This message was sent from Node js server.',
    //   html:
    //     'This <i>message</i> was sent from <strong>Node js</strong> server.',
    // })
    // await this.mailTransport()
  }
}
