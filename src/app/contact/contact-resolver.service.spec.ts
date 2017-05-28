import { TestBed, inject } from '@angular/core/testing';

import { ContactResolverService } from './contact-resolver.service';

describe('ContactResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactResolverService]
    });
  });

  it('should ...', inject([ContactResolverService], (service: ContactResolverService) => {
    expect(service).toBeTruthy();
  }));
});
