import { MailerOptions } from "@nestjs-modules/mailer";

export const mailerConfig: MailerOptions = {
    transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        defaults: {
          from: '"SpaceShare" <spacesharevrzn@gmail.com>',
        },
        preview: true,
    }
}