import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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

  @Get('wishlist')
  async isWishlisted(
    @Query('user_id') user_id: number,
    @Query('property_id') property_id: number,
  ) {
    return await this.propertyService.isWishlisted({ user_id, property_id });
  }

  @Get('owned')
  async getOwnProperties(@Query('user_id') id: number) {
    return await this.propertyService.getOwnProperties(+id);
  }

  @Get('wishlist/user')
  async getWishlistedProperties(@Query('user_id') user_id: number) {
    return await this.propertyService.getWishlistedProperty(+user_id);
  }

  @Get(':id')
  async getProperty(@Param('id') id: string) {
    return await this.propertyService.getProperty(+id);
  }

  @Delete(':id')
  async deleteProperty(@Param('id') id: string) {
    return await this.propertyService.deleteProperty(+id);
  }

  @Post('wishlist')
  async wishlist(
    @Body() wishlistItem: { user_id: number; property_id: number },
  ) {
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
  @UseInterceptors(FilesInterceptor('files'))
  @Patch('edit/:id')
  async updateProperty(
    @Param('id') propertyId: number,
    @Body() property: Prisma.PropertyUpdateInput,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() request: Request,
  ) {
    return await this.propertyService.updateProperty(propertyId, property, files, request);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async rateProperty(@Body() propertyRating: { id: number; rating: number }) {
    return await this.propertyService.rateProperty(propertyRating);
  }
}
