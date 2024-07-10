import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation } from '../../model/reservation.model';
import { environment } from '../../../environment/appsettings';

@Injectable({
  providedIn: 'root'
})
export class ReserveService {

  constructor(private http: HttpClient) { }

  sendReservation(reservation: Reservation){
    const url = `${environment.apiUrl}/property/reserve`;

    const headers = new HttpHeaders().set('Accept', 'application/json');

    return this.http.post(url, reservation, {
      headers: headers,
      withCredentials: true,
    });
  }
}
