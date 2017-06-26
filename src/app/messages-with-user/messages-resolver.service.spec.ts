import { TestBed, inject } from '@angular/core/testing';

import { MessagesResolver } from './messages-resolver.service';

describe('MessagesResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessagesResolver]
    });
  });

  it('should ...', inject([MessagesResolver], (service: MessagesResolver) => {
    expect(service).toBeTruthy();
  }));
});
