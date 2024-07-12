import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Property, PropertyResponse } from '../../model/property.model';
import { environment } from '../../../environment/appsettings';
import { map, Observable } from 'rxjs';

@Injectable()
export class AddListingService {
  constructor(private httpService: HttpClient) {}

  createProperty(property: Property, files: File[]) {
    const formData = new FormData();

    for (const key in property) {
      if (property.hasOwnProperty(key)) {
        formData.append(key, property[key]!.toString());
      }
    }

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

  getImages(url: string): Observable<File> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    return this.httpService.get(url, { headers, responseType: 'blob'}).pipe(
      map(blob => {
        const fileName = url.split('/').pop() || 'propertyImage';
        return new File([blob], fileName, {
          type: blob.type,
          lastModified: Date.now(),
        })
      })
    )
  }

  updateProperty(propertyId: number, property: Property, files: File[]){
    const formData = new FormData();
    
    Object.keys(property).forEach(key => {
      const value = property[key]
      if(value !== undefined && value !== null && key !== 'files') {
        formData.append(key, value.toString());
      }
    })

    for(let i = 0; i < files.length; i++){
      formData.append('files', files[i])
    }

    const url = `${environment.apiUrl}/property/edit/${propertyId}`;

    const headers = new HttpHeaders().set('Accept', 'application/json');

    return this.httpService.patch(url, formData, {
      headers: headers,
      withCredentials: true
    });
  }
}
