import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/appsettings';
import { Property } from '../../model/property.model';

@Injectable()
export class PropertyService {

  constructor(private http: HttpClient) { }

  getProperty(id: number){
    const url = `${environment.apiUrl}/property/${id}`;
    return this.http.get<Property>(url);
  }
}
