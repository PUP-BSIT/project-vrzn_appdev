import { TestBed } from '@angular/core/testing';

import { PropertyCardService } from './property-card.service';

describe('PropertyCardService', () => {
  let service: PropertyCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
