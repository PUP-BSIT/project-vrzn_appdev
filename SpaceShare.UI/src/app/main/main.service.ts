import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/appsettings';
import { Card } from '../../model/card.model';

@Injectable()
export class MainService {

  constructor(private http: HttpClient) { }

  getProperties(){
    const url = `${environment.apiUrl}/property`;
    return this.http.get<Card[]>(url);
  }
}