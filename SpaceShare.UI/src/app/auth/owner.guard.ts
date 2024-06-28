import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { OwnedService } from '../owned/owned.service';

export const OwnerGuard: CanActivateFn = (route, state) => {
  const propertyId = +route.params['id'];
  const authService = inject(AuthService);
  const ownedService = inject(OwnedService);
  const router = inject(Router);

  const currentUserId = authService.getLoggedUserId();

  return ownedService.getOwnProperties(+currentUserId).pipe(
    map((properties) => {
      const ownsProperty = properties.some(
        (property) => property.id === propertyId
      );
      if (ownsProperty) {
        return true;
      } else {
        router.navigate(['/went-wrong']);
        return false;
      }
    })
  );
};
