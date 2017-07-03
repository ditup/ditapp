import { TestBed, inject } from '@angular/core/testing';
import { HeaderControlService } from './header-control.service';

describe('HeaderControlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeaderControlService]
    });
  });

  it('should ...', inject([HeaderControlService], (service: HeaderControlService) => {
    expect(service).toBeTruthy();
  }));
});
