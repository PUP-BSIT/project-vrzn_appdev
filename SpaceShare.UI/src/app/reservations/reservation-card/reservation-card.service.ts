import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/appsettings';

@Injectable()
export class ReservationCardService {

  constructor(private http: HttpClient) { }

  deleteReservation(reservationId: number){
    const url = `${environment.apiUrl}/property/application/delete/${reservationId}`

    const headers = new HttpHeaders().set('Accept', 'application/json');

    return this.http.delete(url, {
      headers,
      withCredentials: true
    });
  }
}
