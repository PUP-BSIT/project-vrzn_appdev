import { TestBed } from '@angular/core/testing';

import { ReservationCardService } from './reservation-card.service';

describe('ReservationCardService', () => {
  let service: ReservationCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
