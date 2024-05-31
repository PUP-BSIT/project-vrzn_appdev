import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { NotFoundError } from 'rxjs';
import { Prisma } from '@prisma/client';
import { S3Service } from 'src/s3/s3.service';
import { url } from 'inspector';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';

@Injectable()
export class PropertyService {
  constructor(
    private prismaService: PrismaService,
    private s3Service: S3Service,
    private authService: AuthService,
  ) {}

  async getProperties() {
    return await this.prismaService.property.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        city: true,
        barangay: true,
        price: true,
        status: true,
        rating: true,
        capacity: true,
      },
    });
  }

  async getProperty(id: number) {
    const property = await this.prismaService.property.findUnique({
      where: { id },
      select: {
        id: true,
        owner_id: true,
        title: true,
        description: true,
        city: true,
        barangay: true,
        price: true,
        status: true,
        rating: true,
        capacity: true,
      },
    });

    if (!property) throw new NotFoundException();

    return { property };
  }

  async createProperty(
    property: Prisma.PropertyCreateInput,
    file: Express.Multer.File,
    request: Request,
  ) {
    const userId = request.cookies['id'];
    const createdProperty = await this.prismaService.property.create({
      data: {
        title: property.title,
        description: property.description,
        region: property.region,
        province: property.province,
        barangay: property.barangay,
        postal_code: property.postal_code,
        price: +property.price,
        status: !!property.status,
        rating: +property.rating,
        capacity: +property.capacity,
        city: property.city,
        property: {
          connect: { id: +userId },
        },
      },
    });
    const key = `${Date.now()}${file[0].originalname}`;
    const imageUrl = await this.s3Service.uploadFile(file[0], key);

    const image = await this.prismaService.images.create({
      data: {
        property_id: createdProperty.id,
        image_url: imageUrl,
      },
    });

    return { createdProperty, image };
  }
}