/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppModelService } from './app-model.service';

describe('AppModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppModelService]
    });
  });

  it('should ...', inject([AppModelService], (service: AppModelService) => {
    expect(service).toBeTruthy();
  }));
});
