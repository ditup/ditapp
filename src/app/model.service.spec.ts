import { TestBed, async, inject } from '@angular/core/testing';

import { FakeBackend } from 'ngx-http-test';

import { ModelService } from './model.service';

import { AuthService } from './auth.service';

class AuthStubService {
  credentials = {
    username: 'test',
    password: 'password'
  };
}

describe('ModelService', () => {
  let service,
      backend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ModelService,
        { provide: AuthService, useClass: AuthStubService },
        FakeBackend.getProviders()
      ]
    });
  });

  beforeEach(inject([ModelService, FakeBackend], (_service: ModelService, _backend: FakeBackend) => {
    service = _service;
    backend = _backend;
  }));

  it('tests should be setup', () => {
    expect(service).toBeTruthy();
  });

  describe('verify email: verifyEmail(username: string, code: string)', () => {

    it('should success', async(async () => {
      backend.expectPatch('https://dev.ditup.org/api/account', {
        data: {
          type: 'users',
          id: 'test-user',
          attributes: {
            emailVerificationCode: 'verificationCode'
          }
        }
      }).respond({});
      const response = await service.verifyEmail('test-user', 'verificationCode');
      console.log(response);
      expect(response).toEqual('some-email');
    }));

  });

  describe('findTagsByMyTags()', () => {

    it('should success', async(async () => {
      backend.expectGet('https://dev.ditup.org/api/tags?filter[relatedToMyTags]').respond({
        data: [
          { type: 'tags', id: 'tag0' },
          { type: 'tags', id: 'tag1' },
          { type: 'tags', id: 'tag2' },
          { type: 'tags', id: 'tag3' }
        ]
      });
      const response = await service.findTagsByMyTags();
      console.log(response);
      expect(response.length).toEqual(4);
    }));

  });

});
