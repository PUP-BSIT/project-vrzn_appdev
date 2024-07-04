import { Body, Controller, Get, Param, Post, Sse } from '@nestjs/common';
import { EventService } from './event.service';
import { map, Observable } from 'rxjs';
import { NotificationEvent } from './dto/notification.event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('sse')
  @Sse()
  sse(): Observable<MessageEvent> {
    return this.eventService.notificationEvent$.pipe(
      map((event: NotificationEvent) => ({
        data: event,
      })),
    );
  }

  @Get('notification/reservation/:id')
  async getReservationNotifications(@Param('id') userId: number) {
    return await this.eventService.getReservationNotification(userId);
  }

  @Get('notification/application/:id')
  async getApplicationNotification(@Param('id') userId: number){
    return await this.eventService.getApplicationNotification(userId);
  }

  @Post('notified/application')
  async setApplicationNotificationAsRead(@Body() user : { userId: number }){
    return await this.eventService.setApplicationNotificationAsRead(user.userId);
  }

  @Post('notified/reservation')
  async setReservationNotificationAsRead(@Body() user: { userId: number }){
    return await this.eventService.setReservationNotificationAsRead(user.userId);
  }
}

interface MessageEvent {
  data: NotificationEvent;
}
