import { TestBed, inject } from '@angular/core/testing';
import { FooterControlService } from './footer-control.service';

describe('FooterControlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FooterControlService]
    });
  });

  it('should ...', inject([FooterControlService], (service: FooterControlService) => {
    expect(service).toBeTruthy();
  }));
});
