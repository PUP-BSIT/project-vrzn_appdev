import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environment/appsettings';
import { User } from '../../../../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class HostService {

  constructor(private http: HttpClient) { }

  getUser(id: number) {
    const url = `${environment.apiUrl}/auth/${id}`;
    return this.http.get<User>(url);
  }

  
}
