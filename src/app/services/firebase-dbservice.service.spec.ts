import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { FirebaseDBServiceService } from './firebase-dbservice.service';

describe('FirebaseDBServiceService', () => {
  let service: FirebaseDBServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(FirebaseDBServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
