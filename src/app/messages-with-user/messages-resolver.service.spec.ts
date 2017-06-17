import { TestBed, inject } from '@angular/core/testing';

import { MessagesResolverService } from './messages-resolver.service';

describe('MessagesResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessagesResolverService]
    });
  });

  it('should ...', inject([MessagesResolverService], (service: MessagesResolverService) => {
    expect(service).toBeTruthy();
  }));
});
