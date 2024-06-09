import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Prisma } from '@prisma/client';
import { Express, Request } from 'express';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProperties() {
    return await this.propertyService.getProperties();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProperty(@Param() id: number) {
    return await this.propertyService.getProperty(id);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('file'))
  @Post()
  async createProperty(
    @Body() property: Prisma.PropertyCreateInput,
    @UploadedFiles() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    return await this.propertyService.createProperty(property, file, request);
  }
}
