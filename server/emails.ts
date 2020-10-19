import nodemailer from 'nodemailer';
import config from "./config";
import Mail from "nodemailer/lib/mailer";
import {MailOptions} from "nodemailer/lib/smtp-transport";

/**
 * Config for our smtp mail client.
 */
const options = {
  host: config.NODE_MAILER.HOST,
  port: 465,
  secure: true,
  auth: {
    user: config.NODE_MAILER.EMAIL,
    pass: config.NODE_MAILER.PASS,
  }
}

/**
 * Simple Handler class designed to obfuscate any complexity when handling
 * password reset emails.
 */
class EmailHandler {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport(options);
  }

  /**
   * Send an email from the servers default host email address with the following
   * target email, subject and text body.
   *
   * @param email - the email to send to.
   * @param subject - the subject in email header.
   * @param text - the body of the email.
   */
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
