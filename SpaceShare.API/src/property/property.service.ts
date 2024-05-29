import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class PropertyService {
  constructor(private prismaService: PrismaService) {}

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
        capacity: true
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
}
