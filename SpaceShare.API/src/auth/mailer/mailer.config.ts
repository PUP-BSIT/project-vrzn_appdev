
import { ConfigService } from "@nestjs/config";
import { MailerOptions } from "@nestjs-modules/mailer";

export const mailerConfig = (
  configService: ConfigService,
): MailerOptions => {
  const host = configService.get<string>('EMAIL_HOST');
  const user = configService.get<string>('EMAIL_USERNAME');
  const pass = configService.get<string>('EMAIL_PASSWORD');

  return {
    transport: {
      host,
      port: 587,
      secure: false,
      auth: {
        user,
        pass,
      },
      logger: true,
      debug: true,
    },
    defaults: {
      from: '"SpaceShare" <spacesharevrzn@gmail.com>',
    },
    preview: true,
  };
};
