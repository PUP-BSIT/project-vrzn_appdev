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

  @Get('notifications')
  async getNotifications(@Param('id') userId: number) {
    return await this.eventService.getNotification(userId);
  }

  @Post('notified')
  async setNotificationAsRead(@Body() userId: number){
    return await this.eventService.setNotificationAsRead(userId);
  }
}

interface MessageEvent {
  data: NotificationEvent;
}
