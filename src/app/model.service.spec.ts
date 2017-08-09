import { TestBed, async, inject } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { FakeBackend } from 'ngx-http-test';

import { ModelService } from './model.service';

import { AuthService } from './auth.service';

import { Tag, UserTag } from './shared/types';

class AuthStubService {
  credentials = {
    username: 'test',
    password: 'password'
  };

  get username () {
    return this.credentials.username;
  }
}

describe('ModelService', () => {
  const baseUrl = 'https://dev.ditup.org/api';
  let service,
      backend,
      httpMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ModelService,
        { provide: AuthService, useClass: AuthStubService },
        FakeBackend.getProviders(),
      ]
    });
  });

  beforeEach(inject([ModelService, FakeBackend, HttpTestingController],
                    (_service: ModelService, _backend: FakeBackend, _httpMock: HttpTestingController) => {
    service = _service;
    backend = _backend;
    httpMock = _httpMock;
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
      expect(response.length).toEqual(4);
    }));

  });

  describe('findTagsByTags()', () => {

    it('should success', async(async () => {
      backend.expectGet('https://dev.ditup.org/api/tags?filter[relatedToTags]=tag0,tag1,tag2').respond({
        data: [
          { type: 'tags', id: 'tag3' },
          { type: 'tags', id: 'tag4' },
          { type: 'tags', id: 'tag5' },
          { type: 'tags', id: 'tag6' }
        ]
      });
      const response = await service.findTagsByTags([
        { tagname: 'tag0' },
        { tagname: 'tag1' },
        { tagname: 'tag2' }
      ] as Tag[]);
      expect(response.length).toEqual(4);
    }));

  });

  describe('findRandomTags()', () => {
    it('should success', async(async () => {
      backend.expectGet('https://dev.ditup.org/api/tags?filter[random]').respond({
        data: [
          { type: 'tags', id: 'tag3' }
        ]
      });
      const response = await service.findRandomTags();
      expect(response.length).toEqual(1);
    }));
  });

  describe('findNewUsers()', () => {
    it('should success', async(async () => {
      backend.expectGet('https://dev.ditup.org/api/users?sort=-created&page[offset]=0&page[limit]=5').respond({
        data: [
          { type: 'users', id: 'user0' },
          { type: 'users', id: 'user1' },
          { type: 'users', id: 'user2' },
          { type: 'users', id: 'user3' },
          { type: 'users', id: 'user4' }
        ]
      });
      const response = await service.findNewUsers();
      expect(response.length).toEqual(5);
    }));
  });

  describe('changePassword()', () => {
    it('should make a correct request', async(async () => {
      const changePasswordPromise = service.changePassword('pwd', 'pwd2');

      const req = httpMock.expectOne(`${baseUrl}/account`);

      expect(req.request.method).toEqual('PATCH');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization'));

      req.flush(null);
      await changePasswordPromise;
    }));
  });

  describe('readUserTags()', () => {

    it('should make a correct request', async(async () => {

      const username = 'username';

      // execute the function
      const readUserTagsPromise = service.readUserTags(username);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/users/${username}/tags`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization'));

      req.flush({
        data: [],
        included: []
      });
      await readUserTagsPromise;
    }));

    it('should return an array of UserTags', async(async () => {
      const username = 'user';

      const readUserTagsPromise = service.readUserTags(username);

      const req = httpMock.expectOne(`${baseUrl}/users/${username}/tags`);

      // send the response
      req.flush({
        data: [
          {
            type: 'user-tags',
            id: `${username}--tag0`,
            attributes: { story: 'story', relevance: 5 },
            relationships: {
              user: { data: { type: 'users', id: username } },
              tag: { data: {type: 'tags', id: 'tag0' } }
            }
          },
        ],
        included: [
          {
            type: 'users',
            id: username,
            attributes: { givenName: '', familyName: '', username, description: '' }
          },
          { type: 'tags', id: 'tag0', attributes: { tagname: 'tag0' } }
        ]
      });

      const userTags: UserTag[] = await readUserTagsPromise;

      expect(userTags.length).toEqual(1);
      expect(userTags[0]).toEqual(jasmine.objectContaining({
        user: { username, givenName: '', familyName: '', description: '' },
        tag: { tagname: 'tag0' },
        story: 'story',
        relevance: 5
      }));
    }));
  });

  // verify that there are no outstanding requests remaining
  afterEach(() => {
    httpMock.verify();
  });

});
