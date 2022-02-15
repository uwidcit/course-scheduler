import { TestBed } from '@angular/core/testing';

import { FirebaseDBServiceService } from './firebase-dbservice.service';

describe('FirebaseDBServiceService', () => {
  let service: FirebaseDBServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseDBServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
