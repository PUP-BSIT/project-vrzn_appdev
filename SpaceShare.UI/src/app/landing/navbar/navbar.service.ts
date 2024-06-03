import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/appsettings';

// Define a type for the response data
interface LoginResponse {
  success: boolean;
  message: string;
  id: string,
  token: string
}


@Injectable()
export class NavbarService {
  constructor(
  private http: HttpClient,
  ) {}

  signout() {
    const url = `${environment.apiUrl}/auth/signout`;
    return this.http.get<LoginResponse>(url);
  } 
}
