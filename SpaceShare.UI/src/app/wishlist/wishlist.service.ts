import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Property } from '../../model/property.model';
import { environment } from '../../../environment/appsettings';
import { Card } from '../../model/card.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  
  constructor(private http: HttpClient) {}

  getProperties(id: number) {
    const url = `${environment.apiUrl}/property/wishlist/user?user_id=${id}`;
    return this.http.get<Card[]>(url);
  }
}
