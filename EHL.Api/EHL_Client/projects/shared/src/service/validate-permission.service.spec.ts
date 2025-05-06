import { TestBed } from '@angular/core/testing';

import { ValidatePermissionService } from './validate-permission.service';

describe('ValidatePermissionService', () => {
  let service: ValidatePermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidatePermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
