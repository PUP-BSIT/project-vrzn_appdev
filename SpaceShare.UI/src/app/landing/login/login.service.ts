import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../../environment/appsettings';
import { CookieService } from 'ngx-cookie-service';

// Define a type for the response data
interface LoginResponse {
  success: boolean;
  message: string;
  id: string,
  token: string
}

type Credentials = {
  email: string;
  password: string;
};

@Injectable()
export class LoginService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(value: Credentials): Observable<LoginResponse> {
    const url = `${environment.apiUrl}/auth/signin`;
    return this.http.post<LoginResponse>(url, value)
      .pipe(
        tap((response: LoginResponse) => {
          this.cookieService.set('token', response.token)
          this.cookieService.set('id', response.id)
        })
      )
  }
}
