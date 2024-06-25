import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Property, PropertyResponse } from '../../model/property.model';
import { environment } from '../../../environment/appsettings';

@Injectable()
export class AddListingService {
  constructor(private httpService: HttpClient) {}

  createProperty(property: Property, files: File[]) {
    const formData = new FormData();

    // Append property data
    for (const key in property) {
      if (property.hasOwnProperty(key)) {
        formData.append(key, property[key]!.toString());
      }
    }

    // Append files
    for (const file of files) {
      formData.append('files', file, file.name);
    }

    const url = `${environment.apiUrl}/property`;

    const headers = new HttpHeaders().set('Accept', 'application/json');

    return this.httpService.post<PropertyResponse>(url, formData, {
      headers: headers,
      withCredentials: true,
    });
  }
}
