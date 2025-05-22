import { TestBed } from '@angular/core/testing';

import { SessiontimeoutService } from './sessiontimeout.service';

describe('SessiontimeoutService', () => {
  let service: SessiontimeoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessiontimeoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
