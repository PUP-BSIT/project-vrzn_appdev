import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, Property } from '@prisma/client';
import { S3Service } from 'src/s3/s3.service';
import { Request } from 'express';
import { Reservation } from './dto/reserve.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { AuthService } from 'src/auth/auth.service';
import { Notification } from './dto/notification.dto';
import { EventService } from 'src/event/event.service';
import { environment } from 'environment/app.settings';

@Injectable()
export class PropertyService {
  constructor(
    private prismaService: PrismaService,
    private s3Service: S3Service,
    private mailService: MailerService,
    private authService: AuthService,
    private eventService: EventService,
  ) {}

  async getProperties() {
    return await this.prismaService.property.findMany({
      where: {
        status: false,
      },
      select: {
        id: true,
        owner_id: true,
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
        owner_id: +id,
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
  ) {
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
        status: !this.getBoolean(property.status),
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

    await this.prismaService.tenantApplication.deleteMany({
      where: {
        property_id: id,
      },
    });

    await this.prismaService.spaceHistory.deleteMany({
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

  async reserveProperty(application: Reservation) {
    const hasReserved = await this.prismaService.tenantApplication.findMany({
      where: {
        applicant_id: application.applicant_id,
        property_id: application.property_id,
      },
    });

    if (hasReserved.length) return;

    const reservation = await this.prismaService.tenantApplication.create({
      data: {
        property_id: +application.property_id,
        applicant_id: +application.applicant_id,
        status: application.status,
        notes: application.notes,
      },
    });

    const property = await this.prismaService.property.findUnique({
      where: { id: application.property_id },
    });

    if (!reservation) return;

    await this.eventService.createNotification({
      userToUpdate: +property.owner_id,
      isApplication: true,
      isReservation: false,
    });

    return reservation;
  }

  async acceptApplication(id: number) {
    const updated = await this.prismaService.tenantApplication.update({
      where: {
        id,
      },
      data: {
        status: 'Approved',
      },
    });

    if (!updated) return { success: false };

    const application = await this.prismaService.tenantApplication.findUnique({
      where: {
        id,
      },
    });

    await this.prismaService.property.update({
      where: {
        id: application.property_id,
      },
      data: {
        status: true,
      },
    });

    await this.prismaService.spaceHistory.create({
      data: {
        property_id: +application.property_id,
        tenant_id: +application.applicant_id,
      },
    });

    await this.eventService.createNotification({
      userToUpdate: +application.applicant_id,
      isApplication: false,
      isReservation: true,
    });

    return { success: true };
  }

  async getSpaceHistories(property_id: number, tenant_id: number) {
    return await this.prismaService.spaceHistory.findMany({
      where: {
        property_id,
        tenant_id,
      },
    });
  }

  async rejectApplication(id: number) {
    const updated = this.prismaService.tenantApplication.update({
      where: {
        id,
      },
      data: {
        status: 'Rejected',
      },
    });

    if (!updated) return;

    await this.eventService.createNotification({
      userToUpdate: (await updated).applicant_id,
      isApplication: false,
      isReservation: true,
    });

    return updated ? { success: true } : { success: false };
  }

  async deleteApplication(id: number) {
    return await this.prismaService.tenantApplication.delete({
      where: {
        id,
      },
    });
  }

  async getReservations(id: number) {
    return await this.prismaService.tenantApplication.findMany({
      where: {
        applicant_id: +id,
      },
    });
  }

  async getPropertyApplications(owner_id: number) {
    const properties = await this.getOwnProperties(+owner_id);
    const ownedSpaceIds = properties.map((property) => property.id);

    return this.prismaService.tenantApplication.findMany({
      where: {
        property_id: {
          in: ownedSpaceIds,
        },
        status: 'Pending',
      },
    });
  }

  async rateProperty(propertyRating: { id: number; rating: number }) {
    const property = await this.getProperty(propertyRating.id);
    const propertyHistory = await this.prismaService.spaceHistory.findMany({
      where: { property_id: propertyRating.id },
    });

    if (!property) return;

    const currentRating = property.rating ?? 0;
    const currentRatingCount = propertyHistory.length;
    const newRating =
      (currentRating * currentRatingCount + propertyRating.rating) /
      (currentRatingCount + 1);

    return await this.prismaService.property.update({
      where: {
        id: propertyRating.id,
      },
      data: {
        rating: newRating,
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

  getBoolean(value) {
    switch (value) {
      case true:
      case 'true':
      case 1:
      case '1':
      case 'on':
      case 'yes':
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

  //#region mail services
  async sendReservationMail(body: Reservation) {
    const applicant = await this.authService.getUser(body.applicant_id);
    const property = await this.getProperty(body.property_id);
    const owner = await this.authService.getUser(property.owner_id);
    const email = await this.mailService.sendMail({
      to: owner.email,
      subject: 'New Reservation Application!',
      html: `${property.title} has a new reservation! \n\n\n 
              Applicant notes: ${body.notes} \n\n\n
              aBOUT THE APPLICANT: \n
              name: ${applicant.first_name} \n
              email: ${applicant.email} \n
              phone: ${applicant.phone_number[0].number}`, //needs to be updated
    });

    return email;
  }

  async sendReservationUpdate(
    body: Reservation,
    status: 'Accepted' | 'Rejected',
  ) {
    const applicant = await this.authService.getUser(body.applicant_id);
    const property = await this.getProperty(body.property_id);

    return await this.mailService.sendMail({
      to: applicant.email,
      subject: `${property.title} = Update on Your Space Share Application`,
      html: `
        <!DOCTYPE html>
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum=1">
            <meta http-equiv="X-UA-Compatible" content="IE=Edge">
            <style type="text/css">
                body, p, div {
                    font-family: 'Poppins', Arial, Helvetica, sans-serif;
                    font-size: 14px;
                    color: #000;
                }
                body a {
                    color: #0074a6;
                    text-decoration: none;
                }
                body a:visited {
                    color: #0074a6;
                    text-decoration: none;
                }
                .code-block, .code-block a {
                    background-color: #8644a2;
                    color: #fff !important;
                    border: none;
                    border-radius: 6px;
                    display: inline-block;
                    padding: 16px 24px;
                    font-size: 18px;
                    margin-top: 2rem;
                    text-decoration: none;
                }
                .code-block a:visited {
                    color: #fff !important;
                    text-decoration: none;
                }
                .code-block a:hover {
                    color: #fff !important;
                    text-decoration: none;
                }
                .code-block a:active {
                    color: #fff !important;
                    text-decoration: none;
                }
                .link p {
                    font-size: 12px;
                }
                .link-copy, .link-copy:visited {
                    color: #0074a6;
                    text-decoration: none;
                }
                .contact-text {
                    font-size: 12px;
                }
                p { margin: 0; padding: 0; }
                table.wrapper {
                    width: 100% !important;
                    table-layout: fixed;
                    -webkit-font-smoothing: antialiased;
                    -webkit-text-size-adjust: 100%;
                    -moz-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                }
                img.max-width {
                    max-width: 100% !important;
                }
                .title { 
                    font-weight: bold;
                    font-size: 24px; 
                }
                .property-title {
                    color: #8644a2;
                    font-weight: bold;
                }
                .status {
                    font-weight: bold;
                }
                .status-accepted {
                    color: green;
                }
                .status-rejected {
                    color: red;
                }
                @media screen and (max-width:480px) {
                    table.wrapper-mobile {
                        width: 100% !important;
                        table-layout: fixed;
                    }
                    img.max-width {
                        height: auto !important;
                        max-width: 100% !important;
                    }
                    .columns, .column {
                        width: 100% !important;
                        display: block !important;
                    }
                }
            </style>
        </head>
        <body>
            <center class="wrapper" style="font-size: 14px; font-family: Arial, Helvetica, sans-serif; color: #000; background-color: #f6f7f8;">
                <div class="webkit">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#f6f7f8">
                        <tr>
                            <td valign="top" bgcolor="#f6f7f8" width="100%">
                                <table width="100%" role="content-container" align="center" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td width="100%">
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;" align="center">
                                                <tr>
                                                    <td style="padding: 0; color: #000; text-align: left;" bgcolor="#fff" width="100%" align="left">
                                                        <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                            <tr>
                                                                <td style="padding: 0;" height="20px" bgcolor="#8644a2"></td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 15px 0 10px;" align="center">
                                                                    <img class="max-width" style="margin-top: 1rem;" src="https://vrzn-spaceshare-dev.s3.ap-southeast-1.amazonaws.com/profiles.png" alt="" width="40">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 18px;" align="center">
                                                                    <div style="text-align: center; margin-bottom: 1rem;">
                                                                        <p>Your application was reviewed by the property owner of 
                                                                        <div style="text-align: center;">
                                                                            <a href="${environment.originUrl}/reservations" class="code-block">${property.title}</a>
                                                                        </div>
                                                                        <div class="link" style="text-align: center; margin-top: 1rem;">
                                                                            <p>or copy and paste this link in your browser</p>
                                                                            <p class="link-copy">${environment.originUrl}/reservations</p>
                                                                        </div>
                                                                    </div>
                                                                    <div style="text-align: center; margin-top: 2rem;">
                                                                        <p>The application status is: 
                                                                        <span class="status ${status === 'Accepted' ? 'status-accepted' : 'status-rejected'}">
                                                                            ${status}
                                                                        </span>.
                                                                        </p>
                                                                    </div>
                                                                    <div style="text-align: center; margin-top: 2rem;">
                                                                        <p>${status === 'Accepted' ? 'Congratulations on your successful application! 🎉 We are thrilled to welcome you to the Space Share community. We hope you enjoy your new space and make the most out of it.' : 'Unfortunately, your application was not successful this time. However, do not be discouraged! We have many other wonderful properties available for you to explore. Keep searching and you will find the perfect space for your needs.'}</p>
                                                                    </div>
                                                                    <div style="text-align: center; margin-top: 2rem;">
                                                                        <p>Thank you for using Space Share. We are committed to helping you find the best spaces to meet your needs.</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 10px 0;" align="center"></td>
                                                            </tr>
                                                            <tr>
                                                                <td style="padding: 30px 50px; background-color: #f6f7f8;" align="center">
                                                                    <div style="text-align: center;">
                                                                        <img class="max-width" src="https://vrzn-spaceshare-dev.s3.ap-southeast-1.amazonaws.com/logo.png" alt="" width="60">
                                                                    </div>
                                                                    <div style="text-align: center;">
                                                                        <span class="contact-text">Need a hand? 👋 </span>
                                                                    </div>
                                                                    <div style="text-align: center;">
                                                                        <span class="contact-text">If you have any questions or need help,</span>
                                                                    </div>
                                                                    <div style="text-align: center;">
                                                                        <span class="contact-text">you can reach us at <a href="mailto:support@space-share.site">support@space-share.site</a>.</span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </center>
        </body>
        </html>
        `,
    });
  }
  //#endregion
}
