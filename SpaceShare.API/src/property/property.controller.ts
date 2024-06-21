import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Prisma } from '@prisma/client';
import { Express, Request } from 'express';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  async getProperties() {
    return await this.propertyService.getProperties();
  }

  @Get(':id')
  async getProperty(@Param('id') id: string) {
    return await this.propertyService.getProperty(+id);
  }

  @Post('wishlist')
  async wishlist(@Body() wishlistItem : { user_id: number, property_id: number }){
    return await this.propertyService.wishlist(wishlistItem);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  async createProperty(
    @Body() property: Prisma.PropertyCreateInput,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() request: Request,
  ) {
    return await this.propertyService.createProperty(property, files, request);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async rateProperty(@Body() propertyRating: { id: number, rating: number }){
    return await this.propertyService.rateProperty(propertyRating);
  }
}
