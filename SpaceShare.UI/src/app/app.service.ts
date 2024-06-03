import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/appsettings';
import { TestModel } from '../../model/TestModel';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private http: HttpClient) {}

  getTestApi(): Observable<TestModel> {
    return this.http.get<TestModel>(environment.apiUrl);
  }
}
