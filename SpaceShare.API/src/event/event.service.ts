import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Subject } from 'rxjs';
import { Notification } from 'src/property/dto/notification.dto';
import { NotificationEvent } from './dto/notification.event.dto';


@Injectable()
export class EventService {
  private notificationEvents = new Subject<NotificationEvent>();

  constructor(private readonly prismaService: PrismaService) {}

  get notificationEvent$() {
    return this.notificationEvents.asObservable();
  }

  async createNotification(notification: Notification) {
    const createdNotification = await this.prismaService.notification.create({
      data: {
        userToUpdate: +notification.userToUpdate,
        isApplication: notification.isApplication,
        isReservation: notification.isReservation,
        is_read: false,
      },
    });

    const { userToUpdate, isApplication, isReservation } = notification;

    this.notificationEvents.next({
      userToUpdate,
      isApplication,
      isReservation,
    });

    return createdNotification;
  }

  async getReservationNotification(userId: number) {
    return await this.prismaService.notification.findMany({
      where: { id: userId, isReservation: true, is_read: false },
    });
  }

  async getApplicationNotification(userId: number) {
    return await this.prismaService.notification.findMany({
      where: { id: userId, isApplication: true, is_read: false },
    });
  }

  async setReservationNotificationAsRead(userId: number) {
    const now = new Date();
    return await this.prismaService.notification.updateMany({
      where: {
        userToUpdate: userId,
        isReservation: true,
        created_at: {
          gt: now,
        },
      },
      data: {
        is_read: true,
      },
    });
  }

  async setApplicationNotificationAsRead(userId: number) {
    const now = new Date();
    return await this.prismaService.notification.updateMany({
      where: {
        userToUpdate: userId,
        isApplication: true,
        created_at: {
          gt: now,
        },
      },
      data: {
        is_read: true,
      },
    });
  }
}
