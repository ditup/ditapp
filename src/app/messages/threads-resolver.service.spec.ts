import { TestBed, inject } from '@angular/core/testing';

import { ThreadsResolverService } from './threads-resolver.service';

describe('ThreadsResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThreadsResolverService]
    });
  });

  it('should ...', inject([ThreadsResolverService], (service: ThreadsResolverService) => {
    expect(service).toBeTruthy();
  }));
});
