import { TestBed, inject } from '@angular/core/testing';

import { MessagesResolver } from './messages-resolver.service';

import { ModelService } from '../model.service';

class ModelStubService { }

describe('MessagesResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessagesResolver,
        { provide: ModelService, useClass: ModelStubService }
      ],
    });
  });

  it('should ...', inject([MessagesResolver], (service: MessagesResolver) => {
    expect(service).toBeTruthy();
  }));
});
