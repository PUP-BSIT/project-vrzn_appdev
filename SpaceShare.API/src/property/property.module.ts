import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { S3Module } from 'src/s3/s3.module';
import { AuthModule } from 'src/auth/auth.module';
import { EventModule } from 'src/event/event.module';

@Module({
  controllers: [PropertyController],
  providers: [PropertyService, JwtStrategy],
  imports: [S3Module, AuthModule, EventModule]
})
export class PropertyModule {}
