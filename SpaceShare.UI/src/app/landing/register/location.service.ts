import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Region, Province, City, Barangay } from '../../../model/location.model';

@Injectable()
export class LocationService {
  private regionUrl = '../../../assets/ph-json/region.json';
  private provinceUrl = '../../../../assets/ph-json/province.json';
  private cityUrl = '../../../assets/ph-json/city.json';
  private barangayUrl = '../../../assets/ph-json/barangay.json';

  constructor(private http: HttpClient) {}

  getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(this.regionUrl);
  }

  getProvinces(): Observable<Province[]> {
    return this.http.get<Province[]>(this.provinceUrl);
  }

  getCities(): Observable<City[]> {
    return this.http.get<City[]>(this.cityUrl);
  }

  getBarangays(): Observable<Barangay[]> {
    return this.http.get<Barangay[]>(this.barangayUrl);
  }
}
