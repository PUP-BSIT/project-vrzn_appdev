import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PropertyService {
    constructor(private prismaService: PrismaService) {}

    getProperties(){
        return this.prismaService.property.findMany();
    }
}
