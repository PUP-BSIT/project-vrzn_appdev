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
  
}
