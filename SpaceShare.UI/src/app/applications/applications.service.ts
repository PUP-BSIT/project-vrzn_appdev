import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/appsettings';
import { AuthService } from '../auth/auth.service';
import { Application } from '../../model/application.model';

@Injectable()
export class ApplicationsService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  getUserApplications(){
    const userId = this.auth.getLoggedUserId();
    const url = `${environment.apiUrl}/property/applications/${userId}`;

    return this.http.get<Application[]>(url);
  }

  handleAcceptApplication(application: Application){
    const url = `${environment.apiUrl}/property/application/accept`;

    const headers = new HttpHeaders().set('Accept', 'application/json');
    
    return this.http.post(url, application, {
      headers: headers,
      withCredentials: true
    });
  }
}
