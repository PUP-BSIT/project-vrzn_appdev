import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/appsettings';
import { User, UserToUpdate } from '../../model/user.model';

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
}
