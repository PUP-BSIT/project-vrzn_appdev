import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../../../environment/appsettings';
import { Subject } from 'rxjs';

@Injectable()
export class SseService {
  private eventSource!: EventSource;
  private notificationSubject: Subject<NotificationEvent>
     = new Subject<NotificationEvent>();

  constructor(private zone: NgZone) {}

  initializeEventSource() {
      const sseUrl = `${environment.apiUrl}/event/sse`;

      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onmessage = (event) => {
        this.zone.run(() => {
          const notification: NotificationEvent = JSON.parse(event.data);
          this.notificationSubject.next(notification);
        });
      };

      this.eventSource.onerror = () => {
        this.eventSource.close();
        setTimeout(() => {
          this.initializeEventSource();
        }, 3000);
      };

      this.eventSource.onopen = () => {
        console.log('SSE connection established.');
      };
   }

   getNotificationObservable(): Subject<NotificationEvent> {
    return this.notificationSubject;
   }

   closeConnection(): void {
    if(this.eventSource){
      console.log('sse disconnected');
      this.eventSource.close();
    }
   }
}


export interface NotificationEvent {
  userToUpdate: number;
  isApplication: boolean;
  isReservation: boolean;
}