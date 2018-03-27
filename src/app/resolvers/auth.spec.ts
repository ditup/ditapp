import { TestBed, inject } from '@angular/core/testing';

import { AuthResolver } from './auth';

describe('AuthResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthResolver]
    });
  });

  it('should be created', inject([AuthResolver], (resolver: AuthResolver) => {
    expect(resolver).toBeTruthy();
  }));
});
