import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';

import { RouterStub } from '../../testing/router-stubs';

import { UserResolver } from './user-resolver.service';
import { ModelService } from '../model.service';

class FakeModelService {

}

describe('UserResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserResolver,
        { provide: ModelService, useClass: FakeModelService },
        { provide: Router, useClass: RouterStub },
      ]
    });
  });

  it('should ...', inject([UserResolver], (service: UserResolver) => {
    expect(service).toBeTruthy();
  }));
});
