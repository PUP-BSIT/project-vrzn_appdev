import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/appsettings';
import { AuthService } from '../auth/auth.service';
import { Application } from '../../model/application.model';

@Injectable()
export class ApplicationsService {
  headers = new HttpHeaders().set('Accept', 'application/json');

  constructor(private http: HttpClient, private auth: AuthService) {}

  getUserApplications() {
    const userId = this.auth.getLoggedUserId();
    const url = `${environment.apiUrl}/property/applications/${userId}`;

    return this.http.get<Application[]>(url);
  }

  handleAcceptApplication(application: Application) {
    const url = `${environment.apiUrl}/property/application/accept`;

    return this.http.post< { success: boolean } >(url, application, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  handleRejectApplication(application: Application) {
    const url = `${environment.apiUrl}/property/application/decline`;

    return this.http.post<{ success: boolean }>(url, application, {
      headers: this.headers,
      withCredentials: true,
    });
  }
}
