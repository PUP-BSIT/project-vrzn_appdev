import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv'

async function bootstrap() {
  dotenv.config();
  
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser())
  
  await app.listen(3000);
}
bootstrap();
