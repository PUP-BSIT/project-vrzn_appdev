import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/appsettings';
import { Card } from '../../model/card.model';
import { Subject } from 'rxjs';

@Injectable()
export class MainService {
  private spaceShareClicked = new Subject<void>();
  spaceShareClicked$ = this.spaceShareClicked.asObservable();

  constructor(private http: HttpClient) {}

  getProperties() {
    const url = `${environment.apiUrl}/property`;
    return this.http.get<Card[]>(url);
  }

  spaceShareClick() {
    this.spaceShareClicked.next();
  }
}