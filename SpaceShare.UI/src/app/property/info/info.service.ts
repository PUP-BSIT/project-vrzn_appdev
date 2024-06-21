import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/appsettings';

@Injectable({
  providedIn: 'root',
})
export class InfoService {
  constructor(private http: HttpClient) {}

  url = `${environment.apiUrl}/property/wishlist`;

  wishlist(wishlistItem: { user_id: number; property_id: number }) {
    return this.http.post<{ message: string }>(this.url, wishlistItem);
  }

  isWishlisted(wishlistItem: { user_id: number; property_id: number }) {
    const { user_id, property_id } = wishlistItem; 
    return this.http.get<boolean>(`${this.url}?user_id=${user_id}&property_id=${property_id}`);
  }
}
