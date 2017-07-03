import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthMeGuard } from './auth-me-guard.service';

import { AuthService } from './auth.service';
import { BasicAuthService } from './basic-auth.service';

describe('AuthMeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthMeGuard, AuthService, BasicAuthService],
      imports: [RouterTestingModule]
    });
  });

  it('should ...', inject([AuthMeGuard], (service: AuthMeGuard) => {
    expect(service).toBeTruthy();
  }));
});
