import { TestBed, inject } from '@angular/core/testing';

import { LoggedUserTagsResolver } from './user-tags-resolver.service';
import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';
import { UserTag } from '../shared/types';

class ModelStubService {
  async readUserTags(_username: string): Promise<UserTag[]> {
    const user = { username: 'test-user' };
    return [
      { user, tag: { tagname: 'tag0' }, story: '', relevance: 5 },
      { user, tag: { tagname: 'tag1' }, story: '', relevance: 4 },
      { user, tag: { tagname: 'tag2' }, story: '', relevance: 3 },
      { user, tag: { tagname: 'tag3' }, story: '', relevance: 2 },
      { user, tag: { tagname: 'tag4' }, story: '', relevance: 1 }
    ] as UserTag[];
  }
}

class AuthStubService {
  username = 'test-user';
}

describe('LoggedUserTagsResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoggedUserTagsResolver,
        { provide: ModelService, useClass: ModelStubService },
        { provide: AuthService, useClass: AuthStubService }
      ]
    });
  });

  it('should create', inject([LoggedUserTagsResolver], (service: LoggedUserTagsResolver) => {
    expect(service).toBeTruthy();
  }));

  it('should resolve with tags of the logged user', inject([LoggedUserTagsResolver], async (service: LoggedUserTagsResolver) => {

    const userTags = await service.resolve();
    expect(userTags.length).toEqual(5);
  }));
});
