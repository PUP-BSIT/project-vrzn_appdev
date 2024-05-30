import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  controllers: [PropertyController],
  providers: [PropertyService, JwtStrategy],
})
export class PropertyModule {}
