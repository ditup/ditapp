import { TestBed, inject } from '@angular/core/testing';

import { PeopleWithMyTagsResolver, NewPeopleResolver } from './people-resolver.service';

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

  public async findNewUsers(): Promise<User[]> {
    return [
      { username: 'user0' },
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

  it('should resolve with some people', inject([PeopleWithMyTagsResolver], async (service: PeopleWithMyTagsResolver) => {
    const people = await service.resolve();

    expect(people.length).toEqual(4);
  }));
});

describe('NewPeopleResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NewPeopleResolver,
        { provide: ModelService, useClass: ModelStubService }
      ],
    });
  });

  it('should be created', inject([NewPeopleResolver], (service: NewPeopleResolver) => {
    expect(service).toBeTruthy();
  }));

  it('should resolve with new users', inject([NewPeopleResolver], async (service: NewPeopleResolver) => {
    const people = await service.resolve();

    expect(people.length).toEqual(5);
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
