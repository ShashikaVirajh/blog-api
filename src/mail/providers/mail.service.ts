import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public async sendUserWelcome(user: User) {
    await this.mailerService.sendMail({
      from: '"Onboarding Team" <support_blog@gmail.com>',
      to: user.email,
      subject: 'Welcome to Blog',
      template: './welcome',
      context: {
        name: user.firstName,
        email: user.email,
        loginUrl: 'http://localhost:3001',
      },
    });
  }
}
