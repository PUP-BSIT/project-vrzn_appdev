import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/appsettings';

@Injectable()
export class PropertyCardService {

  constructor(private http: HttpClient) { }

  deleteProperty(id: number){
    const url = `${environment.apiUrl}/property/${id}`
    return this.http.delete<{ success: boolean, message: string }>(url);
  }
}
