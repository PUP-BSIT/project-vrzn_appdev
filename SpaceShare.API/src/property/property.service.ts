import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { S3Service } from 'src/s3/s3.service';
import { Request } from 'express';
import { Reservation } from './dto/reserve.dto';

@Injectable()
export class PropertyService {
  constructor(
    private prismaService: PrismaService,
    private s3Service: S3Service,
  ) {}

  async getProperties() {
    return await this.prismaService.property.findMany({
      where: {
        status: false
      },
      select: {
        id: true,
        title: true,
        area: true,
        description: true,
        city: true,
        barangay: true,
        price: true,
        status: true,
        rating: true,
        bedroom: true,
        capacity: true,
        images: {
          select: {
            image_url: true,
          },
        },
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
        area: true,
        bedroom: true,
        postal_code: true,
        images: {
          select: {
            image_url: true,
          },
        },
      },
    });

    if (!property) throw new NotFoundException();

    return property;
  }

  async getOwnProperties(id: number) {
    return await this.prismaService.property.findMany({
      where: {
        owner_id: id,
      },
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
        area: true,
        bedroom: true,
        images: {
          select: {
            image_url: true,
          },
        },
      },
    });
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
        status: !!!property.status,
        capacity: +property.capacity,
        city: property.city,
        area: +property.area,
        bedroom: +property.bedroom,
        property: {
          connect: { id: +userId },
        },
      },
    });

    const imageArray: { property_id: number; image_url: string }[] = [];

    await Promise.all(
      files.map(async (file) => {
        const key = `${Date.now()}${file.originalname}`;
        const imageUrl = await this.s3Service.uploadFile(file, key);

        const image = await this.prismaService.images.create({
          data: {
            property_id: createdProperty.id,
            image_url: imageUrl,
          },
        });

        imageArray.push(image);
      }),
    );

    return { createdProperty, imageArray };
  }

  async updateProperty(
    propertyId: number,
    property: Prisma.PropertyUpdateInput,
    files: Express.Multer.File[],
  ){
    const existingProperty = await this.prismaService.property.findUnique({
      where: { id: +propertyId },
      include: { images: true },
    });

    if (!existingProperty) throw new NotFoundException('Property not found');

    // Convert the string fields to numbers
    const numericFields = ['price', 'bedroom', 'capacity', 'area'];
    numericFields.forEach((field) => {
      if (
        typeof property[field as keyof Prisma.PropertyUpdateInput] === 'string'
      ) {
        property[field as keyof Prisma.PropertyUpdateInput] = Number(
          property[field as keyof Prisma.PropertyUpdateInput],
        );
      }
    });

    const updatedProperty = await this.prismaService.property.update({
      where: { id: +propertyId },
      data: {
        ...property,
        status: !this.getBoolean(property.status)
      },
    });

    // Handle image updates
    const existingImageUrls = existingProperty.images.map(
      (image) => image.image_url,
    );

    const newFileUrls = await Promise.all(
      files.map(async (file) => {
        const key = `${Date.now()}${file.originalname}`;
        return await this.s3Service.uploadFile(file, key);
      }),
    );

    // Remove images that are no longer in the updated list
    const imagesToDelete = existingImageUrls.filter(
      (url) => !newFileUrls.includes(url),
    );
    await Promise.all(
      imagesToDelete.map(async (url) => {
        await this.prismaService.images.deleteMany({
          where: { image_url: url, property_id: +propertyId },
        });
      }),
    );

    // Add new images
    const imageArray: { property_id: number; image_url: string }[] = [];
    await Promise.all(
      newFileUrls.map(async (imageUrl) => {
        const image = await this.prismaService.images.create({
          data: {
            property_id: +updatedProperty.id,
            image_url: imageUrl,
          },
        });
        imageArray.push(image);
      }),
    );

    return { updatedProperty, imageArray };
  }

  async deleteProperty(id: number) {
    await this.prismaService.images.deleteMany({
      where: {
        property_id: id,
      },
    });

    await this.prismaService.wishlist.deleteMany({
      where: {
        property_id: id,
      },
    });

    const deleted = await this.prismaService.property.delete({
      where: {
        id,
      },
    });

    if (deleted) return { success: true, message: 'Property Deleted' };

    return { success: false, message: 'Something Went Wrong' };
  }

  async reserveProperty(application: Reservation){
    return await this.prismaService.tenantApplication.create({
      data: {
        property_id: +application.property_id,
        applicant_id: +application.user_id,
        status: application.status,
        notes: application.notes
      },
    });
  }

  async rateProperty(propertyRating: { id: number; rating: number }) {
    return await this.prismaService.property.update({
      where: {
        id: propertyRating.id,
      },
      data: {
        rating: propertyRating.rating,
      },
    });
  }

  async wishlist(wishlistItem: { user_id: number; property_id: number }) {
    const { user_id, property_id } = wishlistItem;

    const deleteResult = await this.prismaService.wishlist.deleteMany({
      where: {
        user_id,
        property_id,
      },
    });

    if (deleteResult.count) return { message: 'Removed from wishlist' };

    await this.prismaService.wishlist.create({
      data: {
        user_id,
        property_id,
      },
    });

    return { message: 'Added to wishlist' };
  }

  async getWishlistedProperty(user_id: number) {
    const wishlistedProperties = await this.prismaService.wishlist.findMany({
      where: {
        user_id: +user_id,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            description: true,
            city: true,
            barangay: true,
            price: true,
            bedroom: true,
            area: true,
            status: true,
            rating: true,
            capacity: true,
            images: {
              select: {
                image_url: true,
              },
            },
          },
        },
      },
    });

    return wishlistedProperties.map((wishlistItem) => wishlistItem.property);
  }

  getBoolean(value){
   switch(value){
        case true:
        case "true":
        case 1:
        case "1":
        case "on":
        case "yes":
            return true;
        default: 
            return false;
    }
}

  async isWishlisted(wishlistItem: { user_id: number; property_id: number }) {
    const { user_id, property_id } = wishlistItem;
    const wishlisted = await this.prismaService.wishlist.findMany({
      where: {
        user_id: +user_id,
        property_id: +property_id,
      },
    });

    if (wishlisted.length > 0) return true;

    return false;
  }
}