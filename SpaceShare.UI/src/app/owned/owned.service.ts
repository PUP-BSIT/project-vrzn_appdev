import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/appsettings';
import { Card } from '../../model/card.model';

@Injectable()
export class OwnedService {

  constructor(private httpClient: HttpClient) { }

  getOwnProperties(id: number){
    const url = `${environment.apiUrl}/property/owned?user_id=${id}`;
    return this.httpClient.get<Card[]>(url);
  }
}
