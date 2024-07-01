import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environment/appsettings';
import { Reservation } from '../../model/reservation.model';

@Injectable()
export class ReserveService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  getApplications(){
    const userid = this.auth.getLoggedUserId();
    const url = `${environment.apiUrl}/property/reserve/${userid}`
    return this.http.get<Reservation[]>(url);
  }
}
