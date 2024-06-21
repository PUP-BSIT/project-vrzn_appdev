import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/appsettings';
import { Card } from '../../model/card.model';

@Injectable()
export class MainService {
  constructor(private http: HttpClient) {}

  getProperties(page: number = 1, itemsPerPage: number = 10) {
    const url = `${environment.apiUrl}/property`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', itemsPerPage.toString());
    return this.http.get<Card[]>(url, { params });
  }
}
