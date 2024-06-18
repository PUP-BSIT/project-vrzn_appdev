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
        images: {
          select: {
            image_url: true,
          }
        }
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
    files: Express.Multer.File[],
    request: Request,
  ) {
    const userId = parseInt(request.cookies['id'], 10);
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
        capacity: +property.capacity,
        city: property.city,
        area: +property.area,
        bedroom: +property.bedroom,
        property: {
          connect: { id: +userId },
        },
      },
    });

    const imageArray : { property_id: number, image_url: string }[] = [];

    await Promise.all(files.map(async (file) => {
      const key = `${Date.now()}${file.originalname}`;
      const imageUrl = await this.s3Service.uploadFile(file, key);

      const image = await this.prismaService.images.create({
        data: {
          property_id: createdProperty.id,
          image_url: imageUrl,
        }
      });

      imageArray.push(image);
    }));

    return { createdProperty, imageArray };
  }
}