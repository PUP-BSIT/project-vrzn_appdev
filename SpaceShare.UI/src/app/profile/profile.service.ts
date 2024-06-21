import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/appsettings';
import { User } from '../../model/user.model';

@Injectable()
export class ProfileService {
  constructor(private http: HttpClient) {}

  url = `${environment.apiUrl}/auth`;

  isProfile(user_id: number) {
    return this.http.get<User>(`${this.url}/${user_id}`);
  }
}
