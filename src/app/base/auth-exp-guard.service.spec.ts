import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthExpGuard } from './auth-exp-guard.service';

import { AuthService } from '../auth.service';
import { ModelService } from '../model.service';

class ModelStubService { }

describe('AuthExpGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthExpGuard,
        AuthService,
        { provide: ModelService, useClass: ModelStubService }
      ],
      imports: [RouterTestingModule]
    });
  });

  it('should ...', inject([AuthExpGuard], (service: AuthExpGuard) => {
    expect(service).toBeTruthy();
  }));
});
