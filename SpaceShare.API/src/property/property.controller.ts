import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PropertyService } from './property.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getProperties(){
    return this.propertyService.getProperties();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getProperty(@Param() id: number){
    return this.propertyService.getProperty(id);
  }
}
