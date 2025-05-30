import { TestBed } from '@angular/core/testing';

import { UserIdolService } from './user-idol.service';

describe('UserIdolService', () => {
  let service: UserIdolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserIdolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
