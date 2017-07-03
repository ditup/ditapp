import { TestBed, inject } from '@angular/core/testing';
import { BasicAuthService } from './basic-auth.service';

describe('BasicAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BasicAuthService]
    });
  });

  it('should ...', inject([BasicAuthService], (service: BasicAuthService) => {
    expect(service).toBeTruthy();
  }));
});
