import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { PropertyService } from '../property/property.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PropertyExistsGuard implements CanActivate {
  constructor(
    private propertyService: PropertyService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const id = route.paramMap.get('id');
    return this.propertyService.getProperty(+id!).pipe(
      map((property) => {
        if (property) {
          return true;
        } else {
          return this.router.createUrlTree(['/went-wrong']);
        }
      }),
      catchError(() => {
        return of(this.router.createUrlTree(['/went-wrong']));
      })
    );
  }
}
