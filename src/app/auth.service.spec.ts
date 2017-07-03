import { TestBed, inject } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { BasicAuthService } from './basic-auth.service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, BasicAuthService]
    });
  });

  it('should ...', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
