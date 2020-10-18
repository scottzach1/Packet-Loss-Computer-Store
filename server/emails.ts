import nodemailer from 'nodemailer';
import config from "./config";
import Mail from "nodemailer/lib/mailer";
import {MailOptions} from "nodemailer/lib/smtp-transport";

const options = {
  host: config.NODE_MAILER.HOST,
  port: 465,
  secure: true,
  auth: {
    user: config.NODE_MAILER.EMAIL,
    pass: config.NODE_MAILER.PASS,
  }
}

class EmailHandler {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport(options);
  }

  sendMail(email: string, subject: string, text: string) {
    const mail: MailOptions = {
      to: email,
      from: config.NODE_MAILER.EMAIL,
      subject,
      text,
    };

    this.transporter.sendMail(mail, (err) => {
      if (err) console.error(`Error occurred sending email to ${email}: \n${subject}\n\n${text}`);
    });
  }
}

export default new EmailHandler();
