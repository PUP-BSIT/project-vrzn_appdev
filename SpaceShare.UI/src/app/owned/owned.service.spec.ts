import { TestBed } from '@angular/core/testing';

import { OwnedService } from './owned.service';

describe('OwnedService', () => {
  let service: OwnedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OwnedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
