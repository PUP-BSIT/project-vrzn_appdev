import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environment/appsettings';
import { AuthService } from '../../auth/auth.service';

// Define a type for the response data
interface LoginResponse {
  success: boolean;
  message: string;
  id: string,
  token: string
}


@Injectable()
export class NavbarService {
  constructor(private http: HttpClient) {}

  signout() {
    const url = `${environment.apiUrl}/auth/signout`;
    return this.http.get<LoginResponse>(url);
  }

  getReservationNotification(userId: number) {
    const url = `${environment.apiUrl}/event/notification/reservation/${userId}`;
    return this.http.get(url);
  }

  getApplicationNotification(userId: number) {
    const url = `${environment.apiUrl}/event/notification/application/${userId}`;
    return this.http.get(url);
  }

  setApplicationNotificationAsRead(userId: number) {
    const url = `${environment.apiUrl}/event/notified/application`;
    return this.http.post(url, { userId });
  }

  setReservationNotificationAsRead(userId: number) {
    const url = `${environment.apiUrl}/event/notified/reservation`;
    return this.http.post(url, { userId });
  }
}
