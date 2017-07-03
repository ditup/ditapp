import { TestBed, inject } from '@angular/core/testing';
import { ModelService } from './model.service';

import { AuthService } from './auth.service';

import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

class AuthStubService { }

describe('ModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ModelService,
        Http,
        { provide: AuthService, useClass: AuthStubService },
        { provide: ConnectionBackend, useClass: MockBackend },
        { provide: RequestOptions, useClass: BaseRequestOptions }
      ]
    });
  });

  it('should ...', inject([ModelService], (service: ModelService) => {
    expect(service).toBeTruthy();
  }));
});
