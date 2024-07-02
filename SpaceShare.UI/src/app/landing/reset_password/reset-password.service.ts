import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/appsettings';

@Injectable()
export class ResetPasswordService {

  constructor(private http: HttpClient) { }

  forgotPassword(email: string){
    const url = `${environment.apiUrl}/auth/forgot`

    console.log(email);

    return this.http.post(url, { "email": email });
  }

}
