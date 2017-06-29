import { TestBed, inject } from '@angular/core/testing';

import { TagResolver } from './tag-resolver.service';
import { ModelService } from '../model.service';

class FakeModelService {

}

describe('TagResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TagResolver,
        { provide: ModelService, useClass: FakeModelService }
      ]
    });
  });

  it('should ...', inject([TagResolver], (service: TagResolver) => {
    expect(service).toBeTruthy();
  }));
});
