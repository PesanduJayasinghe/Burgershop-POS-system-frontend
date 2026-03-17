import { TestBed } from '@angular/core/testing';

import { SweetsService } from './sweets.service';

describe('SweetsService', () => {
  let service: SweetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SweetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
