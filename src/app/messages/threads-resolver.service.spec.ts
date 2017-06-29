import { TestBed, inject } from '@angular/core/testing';

import { ThreadsResolver } from './threads-resolver.service';

import { ModelService } from '../model.service';

class ModelStubService { }

describe('ThreadsResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ThreadsResolver,
        { provide: ModelService, useClass: ModelStubService }
      ]
    });
  });

  it('should ...', inject([ThreadsResolver], (service: ThreadsResolver) => {
    expect(service).toBeTruthy();
  }));
});
