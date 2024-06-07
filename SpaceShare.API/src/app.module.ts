import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { PropertyModule } from './property/property.module';
import { S3Module } from './s3/s3.module';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { mailerConfig } from './auth/mailer/mailer.config';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    PropertyModule,
    S3Module,
    MailerModule.forRoot(mailerConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
