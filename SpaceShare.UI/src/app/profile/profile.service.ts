import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/appsettings';
import { User, UserToUpdate } from '../../model/user.model';
import { HttpHeaders } from '@angular/common/http';
@Injectable()
export class ProfileService {

  constructor(private http: HttpClient) {}

  url = `${environment.apiUrl}/auth`;

  getUserProfile(user_id: number) {
    return this.http.get<User>(`${this.url}/${user_id}`);
  }

  updateUserProfile(userToUpdate: {
    user: UserToUpdate;
    oldPhoneNumber: string;
    newPhoneNumber: string;
  }) {
    return this.http.post(`${this.url}/update`, userToUpdate);
  }

  changePassword(passwordChangeRequest: {
    userId: number;
    currentPassword: string;
    newPassword: string;
  }) {
    const headers = new HttpHeaders().set('Accept', 'application/json');
    const changeurl = `${environment.apiUrl}/auth/password/change`;
  
    return this.http.post(changeurl, passwordChangeRequest, {
      headers: headers,
      withCredentials: true,
    });
  }
  
}
