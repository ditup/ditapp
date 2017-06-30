import { TestBed, inject } from '@angular/core/testing';

import { ContactResolver } from './contact-resolver.service';

import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';

class ModelStubService { }
class AuthStubService { }

describe('ContactResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContactResolver,
        { provide: ModelService, useClass: ModelStubService },
        { provide: AuthService, useClass: AuthStubService }
      ]
    });
  });

  it('should ...', inject([ContactResolver], (service: ContactResolver) => {
    expect(service).toBeTruthy();
  }));
});
