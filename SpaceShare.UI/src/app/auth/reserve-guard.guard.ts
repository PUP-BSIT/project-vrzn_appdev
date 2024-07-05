import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { PropertyService } from '../property/property.service';
import { AuthService } from './auth.service';
import { ApplicationsService } from '../applications/applications.service';
import { ReserveService } from '../reservations/reserve.service';

export const reserveGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
) => {
  const authService = inject(AuthService);
  const propertyService = inject(PropertyService);
  const router = inject(Router);
  const reservationService = inject(ReserveService)

  const propertyId = +route.paramMap.get('id')!;
  const currentUserId = authService.getLoggedUserId();

  return propertyService.getProperty(propertyId).pipe(
    switchMap((property) => {
      if (!property) {
        router.navigate(['/went-wrong']);
        return of(false);
      }
      if (property.owner_id === +currentUserId || property.status) {
        router.navigate(['/went-wrong']);
        return of(false);
      }
      return reservationService.getApplications().pipe(
        map((applications) => {
          const hasExistingApplication = applications.some(
            (app) => app.property_id === propertyId
          );
          if (hasExistingApplication) {
            router.navigate(['/went-wrong']);
            return false;
          }
          console.log(applications);
          return true;
        }),
        catchError(() => {
          router.navigate(['/went-wrong']);
          return of(false);
        })
      );
    }),
    catchError(() => {
      router.navigate(['/went-wrong']);
      return of(false);
    })
  );
};
