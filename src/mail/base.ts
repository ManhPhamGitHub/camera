import { env } from '@environments';
import { compile } from 'handlebars';
import { readFile } from 'fs';
import { createTransport } from 'nodemailer';
import { log } from 'console';

export interface CommonParamsType {
  author: string;
  subject: string;
}

export class BaseEmail {
  commonParams: CommonParamsType;
  extraParams?: Record<string, string>;
  emailTemplate: string;

  constructor(emailTemplate,params) {
    this.emailTemplate = emailTemplate || './src/assets/email-templates/mail.html';
    this.commonParams = {
      author: env.get('mail.author'),
      ...params
    };
  }
  
  readHTMLFile(callback: any) {
    readFile(this.emailTemplate, { encoding: 'utf-8' }, (err, html) => {
      if (err) {
        callback(err);
      } else {
        callback(null, html);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sendEmail(email: string, params?: Record<string, any>) {
    if (!email) {
      console.log(`[Send email] missing email`);
      return;
    }

    const transporter = await createTransport({
      secure: true,
      host: env.get('mail.host'),
      port: env.get('mail.port'),
      auth: {
        user: env.get('mail.nodemailerUser'),
        pass: env.get('mail.nodemailerPass'),
      },
    });
    
    const data: CommonParamsType & Record<string, any> = {
      ...this.commonParams,
      ...this.extraParams,
      ...params,
    };

    this.readHTMLFile((err: any, html: any) => {
      const template = compile(html);
      const htmlToSend = template(data);

      const mailOptions = {
        from: `"CMC Cloud" <${env.get('mail.from')}>`,
        to: email,
        subject: data.subject,
        html: htmlToSend,
        attachments: [],
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Send email: ${info.messageId}`);
        }
      });

      transporter.close();
    });
  }
}
