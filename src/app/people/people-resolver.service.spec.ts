import { TestBed, inject, fakeAsync } from '@angular/core/testing';

import * as _ from 'lodash';

import { PeopleWithMyTagsResolver, NewPeopleResolver, PeopleWithTagResolver } from './people-resolver.service';

import { ModelService } from '../model.service';

import { User, Tag } from '../shared/types';

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

  public async findUsersByTags(tags: Tag[]) {
    const users = [
      { username: 'user0', userTags: [{ tag: { tagname: 'tag1' } }] },
      { username: 'user1', userTags: [{ tag: { tagname: 'tag1' } }] },
      { username: 'user2', userTags: [] },
      { username: 'user3', userTags: [{ tag: { tagname: 'tag1' } }] },
      { username: 'user4', userTags: [] }
    ];

    const tagnamesIn = tags.map(tag => tag.tagname);

    return users.filter(user => {
      const userTagnames = user.userTags.map(userTag => userTag.tag.tagname);

      // there are some common tags
      return _.intersection(userTagnames, tagnamesIn).length > 0;
    });
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

describe('PeopleWithTagResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PeopleWithTagResolver,
        { provide: ModelService, useClass: ModelStubService }
      ],
    });
  });

  it('should be created', inject([PeopleWithTagResolver], (service: PeopleWithTagResolver) => {
    expect(service).toBeTruthy();
  }));

  it('should resolve with found users', inject([PeopleWithTagResolver], fakeAsync(async (service: PeopleWithTagResolver) => {
    const routeSnapshotStub: any = {
      parent: { params: { tagname: 'tag1' } }
    };
    const users = await service.resolve(routeSnapshotStub);

    expect(users.length).toEqual(3);
  })));
});
