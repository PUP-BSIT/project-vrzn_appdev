import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignupResponse, User, Verificaion } from '../../../model/user.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/appsettings';

@Injectable()
export class RegisterService {

  constructor(private httpService: HttpClient) { }

  sendMail(verification: Verificaion) {
    const url = `${environment.apiUrl}/auth/verify`;
    return this.httpService.post(url, verification);
  }

  registerUser(user: User) : Observable<SignupResponse>{
    const url = `${environment.apiUrl}/auth/signup`;
    return this.httpService.post<SignupResponse>(url, user);
  }
}
