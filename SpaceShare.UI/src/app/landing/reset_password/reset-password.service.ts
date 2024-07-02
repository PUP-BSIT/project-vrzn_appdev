import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/appsettings';
import { CommonResponse } from '../../../model/user.model';

@Injectable()
export class ResetPasswordService {

  url = `${environment.apiUrl}/auth`

  constructor(private http: HttpClient) { }

  forgotPassword(email: string){
    const apiUrl = `${this.url}/forgot`
    return this.http.post(apiUrl, { email: email });
  }

  resetPassword(token: string, newPassword: string){
    const apiUrl = `${this.url}/reset`;
    return this.http.post<CommonResponse>(apiUrl, { 
      token: token,
      newPassword: newPassword
    })
  }

}
