import nodemailer, { Transporter } from "nodemailer";
import sanitizedConfig from "../config/config.js";
import { Options } from "nodemailer/lib/mailer/index.js";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

export class EmailManager {
    transporter: Transporter<SMTPTransport.SentMessageInfo>;
    constructor() {
        this.transporter = this.init();
    }

    init() {
        console.log("Initialization email transporter.");
        return nodemailer.createTransport({
            host: sanitizedConfig.SMTP_HOST,
            port: sanitizedConfig.SMTP_PORT,
            auth: {
                user: sanitizedConfig.SMTP_EMAIL,
                pass: sanitizedConfig.SMTP_PASSWORD,
            },
        });
    }
    async sendEmail(options: Options) {
        const message = {
            from: `${sanitizedConfig.FROM_NAME} <${sanitizedConfig.FROM_EMAIL}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
        };
        const info = await this.transporter.sendMail(message);
        console.log("Message sent: %s", info.messageId);
    }
}
