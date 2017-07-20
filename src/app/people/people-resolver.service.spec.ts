import { TestBed, inject } from '@angular/core/testing';

import { PeopleWithMyTagsResolver/*, RandomPeopleResolver*/ } from './people-resolver.service';

import { ModelService } from '../model.service';

import { User } from '../shared/types';

class ModelStubService {
  public async findUsersByMyTags(): Promise<User[]> {
    return [
      { username: 'user1' },
      { username: 'user2' },
      { username: 'user3' },
      { username: 'user4' }
    ];
  }
}

describe('PeopleWithMyTagsResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PeopleWithMyTagsResolver,
        { provide: ModelService, useClass: ModelStubService }
      ],
    });
  });

  it('should be created', inject([PeopleWithMyTagsResolver], (service: PeopleWithMyTagsResolver) => {
    expect(service).toBeTruthy();
  }));

  it('should resolve with some tags', inject([PeopleWithMyTagsResolver], async (service: PeopleWithMyTagsResolver) => {
    const tags = await service.resolve();

    expect(tags.length).toEqual(4);
  }));
});

/*
describe('RandomTagsResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RandomTagsResolver,
        { provide: ModelService, useClass: ModelStubService }
      ],
    });
  });

  it('should be created', inject([RandomTagsResolver], (service: RandomTagsResolver) => {
    expect(service).toBeTruthy();
  }));

  it('should resolve with some tags', inject([RandomTagsResolver], async (service: RandomTagsResolver) => {
    const tags = await service.resolve();

    expect(tags.length).toEqual(1);
  }));
});
*/
