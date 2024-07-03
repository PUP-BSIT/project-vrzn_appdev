import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environment/appsettings';

@Injectable()
export class RatingService {

  constructor(private http: HttpClient) {}

  rateProperty(rating: { id: number, rating: number }) {
    const url = `${environment.apiUrl}/property/rate`

    const headers = new HttpHeaders().set('Accept', 'application/json');

    return this.http.post(url, rating, {
      headers,
      withCredentials: true
    });
  }
}
