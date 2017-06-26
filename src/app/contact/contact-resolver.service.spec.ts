import { TestBed, inject } from '@angular/core/testing';

import { ContactResolver } from './contact-resolver.service';

describe('ContactResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactResolver]
    });
  });

  it('should ...', inject([ContactResolver], (service: ContactResolver) => {
    expect(service).toBeTruthy();
  }));
});
