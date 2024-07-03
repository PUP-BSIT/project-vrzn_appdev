import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { reserveGuard } from './reserve-guard.guard';

describe('reserveGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => reserveGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
