import { TestBed, inject } from '@angular/core/testing';

import { ThreadsResolver } from './threads-resolver.service';

describe('ThreadsResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThreadsResolver]
    });
  });

  it('should ...', inject([ThreadsResolver], (service: ThreadsResolver) => {
    expect(service).toBeTruthy();
  }));
});
