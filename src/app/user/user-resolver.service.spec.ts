import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';

import { RouterStub } from '../../testing/router-stubs';

import { UserResolver, LoggedUserResolver } from './user-resolver.service';
import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';
import { User } from '../shared/types';

class ModelStubService {
  async readUser(username: string): Promise<User> {
    return { username };
  }
}

class AuthStubService {
  username = 'test-user';
}

describe('UserResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserResolver,
        { provide: ModelService, useClass: ModelStubService },
        { provide: Router, useClass: RouterStub },
      ]
    });
  });

  it('should ...', inject([UserResolver], (service: UserResolver) => {
    expect(service).toBeTruthy();
  }));
});

describe('LoggedUserResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoggedUserResolver,
        { provide: ModelService, useClass: ModelStubService },
        { provide: AuthService, useClass: AuthStubService }
      ]
    });
  });

  it('should create', inject([LoggedUserResolver], (service: LoggedUserResolver) => {
    expect(service).toBeTruthy();
  }));

  it('should resolve with a logged user', inject([LoggedUserResolver], async (service: LoggedUserResolver) => {

    const user = await service.resolve();
    expect(user.username).toEqual('test-user');
  }));
});
