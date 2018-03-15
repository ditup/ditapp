import { TestBed, async, inject } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { FakeBackend } from 'ngx-http-test';

import { ModelService } from './model.service';

import { AuthService } from './auth.service';

import { Tag, UserTag, Message, Contact } from './shared/types';

// TODO better typing of this library?
import * as b64 from 'b64-to-blob';
const b64ToBlob = b64 as any;

class AuthStubService {
  header = 'Bearer xxx.yyy.zzz';
  username = 'test';
}

describe('ModelService', () => {
  const baseUrl = 'https://dev.ditup.org/api';
  let service,
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

  beforeEach(inject([ModelService, HttpTestingController],
                    (_service: ModelService, _httpMock: HttpTestingController) => {
    service = _service;
    httpMock = _httpMock;
  }));

  it('tests should be setup', () => {
    expect(service).toBeTruthy();
  });

  describe('verify email: verifyEmail(username: string, code: string)', () => {

    it('should success', async(async () => {
      const verifyEmailPromise = service.verifyEmail('test-user', 'verificationCode');
      const req = httpMock.expectOne(`${baseUrl}/account`);

      expect(req.request.method).toEqual('PATCH');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(false);
      expect(req.request.body).toEqual({
        data: {
          type: 'users',
          id: 'test-user',
          attributes: {
            emailVerificationCode: 'verificationCode'
          }
        }
      });

      req.flush({ meta: {
        email: 'email@example.com',
        token: 'aaaa.bbbb.cccc'
      } });
      const response = await verifyEmailPromise;
      expect(response).toEqual({ email: 'email@example.com', token: 'aaaa.bbbb.cccc' });
    }));

  });

  describe('findTagsByMyTags()', () => {

    it('should success', async(async () => {
      const findTagsByMyTagsPromise = service.findTagsByMyTags();

      const req = httpMock.expectOne(`${baseUrl}/tags?filter[relatedToMyTags]`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: [
          { type: 'tags', id: 'tag0' },
          { type: 'tags', id: 'tag1' },
          { type: 'tags', id: 'tag2' },
          { type: 'tags', id: 'tag3' }
        ]
      });

      const response = await findTagsByMyTagsPromise;
      expect(response.length).toEqual(4);
    }));

  });

  describe('findTagsByTags()', () => {

    it('should success', async(async () => {
      const findTagsByTagsPromise = service.findTagsByTags([
        { tagname: 'tag0' },
        { tagname: 'tag1' },
        { tagname: 'tag2' }
      ] as Tag[]);

      const req = httpMock.expectOne(`${baseUrl}/tags?filter[relatedToTags]=tag0,tag1,tag2`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: [
          { type: 'tags', id: 'tag3' },
          { type: 'tags', id: 'tag4' },
          { type: 'tags', id: 'tag5' },
          { type: 'tags', id: 'tag6' }
        ]
      });

      const response = await findTagsByTagsPromise;
      expect(response.length).toEqual(4);
    }));

  });

  describe('findRandomTags(limit = 3)', () => {
    it('should success', async(async () => {
      const findRandomTagsPromise = service.findRandomTags(4);

      const req = httpMock.expectOne(`${baseUrl}/tags?filter[random]&page[offset]=0&page[limit]=4`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: [
          { type: 'tags', id: 'tag3' },
          { type: 'tags', id: 'tag4' },
          { type: 'tags', id: 'tag6' },
          { type: 'tags', id: 'tag0' }
        ]
      });

      const response = await findRandomTagsPromise;
      expect(response.length).toEqual(4);
    }));
  });

  describe('findNewUsers()', () => {

    it('should success', async(async () => {
      const findNewUsersPromise = service.findNewUsers();

      const req = httpMock.expectOne(`${baseUrl}/users?sort=-created&page[offset]=0&page[limit]=5`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: [
          { type: 'users', id: 'user0' },
          { type: 'users', id: 'user1' },
          { type: 'users', id: 'user2' },
          { type: 'users', id: 'user3' },
          { type: 'users', id: 'user4' }
        ]
      });

      const responseData = await findNewUsersPromise;
      expect(responseData.length).toEqual(5);
    }));
  });

  describe('changePassword()', () => {
    it('should make a correct request', async(async () => {
      const changePasswordPromise = service.changePassword('pwd', 'pwd2');

      const req = httpMock.expectOne(`${baseUrl}/account`);

      expect(req.request.method).toEqual('PATCH');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

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
      expect(req.request.headers.has('authorization')).toEqual(true);

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

  describe('addTagToUser()', () => {

    it('should make a correct request', async(async () => {

      const username = 'user';
      const tagname = 'tag';

      // execute the function
      const addTagToUserPromise = service.addTagToUser({ username, tagname, story: '', relevance: 3 });

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/users/${username}/tags`);

      expect(req.request.method).toEqual('POST');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: {
          type: 'user-tags',
          id: `${username}--${tagname}`,
          attributes: {
            story: '',
            relevance: 3
          },
          relationships: {
            user: { data: { type: 'users', id: username } },
            tag: { data: { type: 'tags', id: tagname } }
          }
        },
        included: [
          { type: 'users', id: username, attributes: { username, givenName: 'g', familyName: 'f', description: 'd' } },
          { type: 'tags', id: tagname, attributes: { tagname }}
        ]
      });

      await addTagToUserPromise;
    }));

    it('should return the new UserTag', async(async () => {

      const username = 'user';
      const tagname = 'tag';

      // execute the function
      const addTagToUserPromise = service.addTagToUser({ username, tagname, story: '', relevance: 3 });

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/users/${username}/tags`);

      expect(req.request.method).toEqual('POST');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: {
          type: 'user-tags',
          id: `${username}--${tagname}`,
          attributes: {
            story: '',
            relevance: 3
          },
          relationships: {
            user: { data: { type: 'users', id: username } },
            tag: { data: { type: 'tags', id: tagname } }
          }
        },
        included: [
          { type: 'users', id: username, attributes: { username, givenName: 'g', familyName: 'f', description: 'd' } },
          { type: 'tags', id: tagname, attributes: { tagname }}
        ]
      });

      const userTag = await addTagToUserPromise;

      expect(userTag).toEqual({
        user: { username, givenName: 'g', familyName: 'f', description: 'd' },
        tag: { tagname },
        story: '',
        relevance: 3
      });
    }));
  });

  describe('isUsernameAvailable', () => {
    it('[username exists] should reply false', () => {

      const username = 'user';

      // execute the function
      service.isUsernameAvailable(username).subscribe((data) => {
        expect(data).toEqual(false);
      });

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/users/${username}`);

      expect(req.request.method).toEqual('HEAD');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(false);

      req.flush('', { status: 200, statusText: 'Success' });
    });

    it('[username doesn\'t exist] should reply true', () => {

      const username = 'user';

      // execute the function
      service.isUsernameAvailable(username).subscribe((data) => {
        expect(data).toEqual(true);
      });

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/users/${username}`);

      expect(req.request.method).toEqual('HEAD');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(false);

      req.error({}, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getJwtToken', () => {
    it('should make a correct request', async(async () => {

      const username = 'user';
      const password = 'password';

      const basicAuthHeader = `Basic ${new Buffer(`${username}:${password}`).toString('base64')}`;
      // execute the function
      const tokenPromise = service.getJwtToken(username, password);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/auth/token`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.get('accept')).toEqual('application/vnd.api+json');
      expect(req.request.headers.get('authorization')).toEqual(basicAuthHeader);

      req.flush({
        meta: {
          token: 'xxxx.yyyy.zzzz'
        }
      });

      const token = await tokenPromise;

      expect(token).toEqual('xxxx.yyyy.zzzz');
    }));

  });

  describe('authExpiration', () => {
    it('authentication is valid', async(async () => {
      const authExpirationPromise = service.authExpiration();

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/auth/exp`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        meta: {
          exp: 5000
        }
      });

      const expiration = await authExpirationPromise;
      expect(expiration).toEqual(5000);
    }));

    it('token is expired', async(async () => {
      const authExpirationPromise = service.authExpiration();

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/auth/exp`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.error({
        errors: [{ status: '403', title: 'Not Authorized', detail: 'expired' }]
      }, { status: 403, statusText: 'Not Authorized' });

      const expiration = await authExpirationPromise;
      expect(expiration).toEqual(-1);
    }));
  });

  describe('readUser', () => {
    it('should make a correct request', async(async () => {

      const username = 'user';
      // execute the function
      const readUserPromise = service.readUser(username);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/users/${username}`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: {
          type: 'users',
          id: username,
          attributes: {
            givenName: '',
            familyName: '',
            description: ''
          }
        }
      });

      const loggedUser = await readUserPromise;
      expect(loggedUser).toEqual(jasmine.objectContaining({
        username, givenName: '', familyName: '', description: ''
      }));
    }));

  });

  describe('updateUser', () => {

    it('should make a correct request', async(async () => {

      const username = 'user';
      const givenName = 'given';
      const familyName = 'family';
      const location = [51.3, -43.7];

      // execute the function
      const updateUserPromise = service.updateUser(username, { givenName, familyName, location });

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/users/${username}`);

      expect(req.request.method).toEqual('PATCH');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: {
          type: 'users',
          id: username,
          attributes: {
            givenName,
            familyName,
            description: '',
            location
          }
        }
      });

      const updatedUser = await updateUserPromise;
      expect(updatedUser).toEqual(jasmine.objectContaining({
        username, givenName, familyName, description: '', location
      }));
    }));

  });

  describe('createTag(Tag)', () => {

    it('should make a correct request', async(async () => {

      const tagname = 'tag1';

      // execute the function
      const createTagPromise = service.createTag({ tagname });

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/tags`);

      expect(req.request.method).toEqual('POST');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: {
          type: 'tags',
          id: tagname
        }
      });

      const tag = await createTagPromise;
      expect(tag).toEqual({ tagname });
    }));

  });

  describe('createUser({ username, email, password }', () => {

    it('should make a correct request', async(async () => {

      const username = 'user1';

      // execute the function
      const createUserPromise = service.createUser({ username, email: 'email@example.com', password: 'password' });

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/users`);

      expect(req.request.method).toEqual('POST');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(false);

      req.flush({
        data: {
          type: 'users',
          id: username,
          attributes: {
            givenName: '',
            familyName: '',
            description: '',
            location: null
          }
        }
      });

      const user = await createUserPromise;
      expect(user).toEqual({ username, givenName: '', familyName: '', description: '', location: null });
    }));

  });

  describe('tagExists', () => {
    const tagname = 'tag';
    let req;
    let tagExistsPromise: Promise<boolean>;

    beforeEach(async(async () => {
      // execute the function
      tagExistsPromise = service.tagExists(tagname);
      // mock the backend
      req = httpMock.expectOne(`${baseUrl}/tags/${tagname}`);

      expect(req.request.method).toEqual('HEAD');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);
    }));


    it('[tagname exists] should reply true', async(async () => {
      req.flush('');
      const data = await tagExistsPromise;
      expect(data).toEqual(true);
    }));

    it('[tagname doesn\'t exist] should reply false', async(async () => {
      req.error('', { status: 404, statusText: 'Not Found' });
      const data = await tagExistsPromise;
      expect(data).toEqual(false);
    }));

    it('[tagname is invalid] should reply false', async(async () => {
      req.error('', { status: 400, statusText: 'Bad Data' });
      const data = await tagExistsPromise;
      expect(data).toEqual(false);
    }));
  });

  describe('readTagsLike', () => {
    it('should reply array of tags', () => {

      const tagPath = 'tag-';

      // execute the function
      service.readTagsLike(tagPath).subscribe((data) => {
        expect(data).toEqual([{ tagname: 'tag-1' }, { tagname: 'tag-3' }, { tagname: 'tag-with-green-dots' }]);
      });

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/tags?filter[tagname][like]=${tagPath}`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: [
          { type: 'tags', id: 'tag-1' },
          { type: 'tags', id: 'tag-3' },
          { type: 'tags', id: 'tag-with-green-dots' }
        ]
      });
    });
  });

  describe('updateUserTag(username, tagname, { story?, relevance? })', () => {

    it('should make a correct request', async(async () => {

      const username = 'user1';
      const tagname = 'tag4';
      const story = 'story';
      const relevance = 3;

      // execute the function
      const updateUserTagPromise = service.updateUserTag(username, tagname, { story, relevance });

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/users/${username}/tags/${tagname}`);

      expect(req.request.method).toEqual('PATCH');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: {
          type: 'user-tags',
          id: `${username}--${tagname}`,
          attributes: {
            story,
            relevance
          },
          relationships: {
            user: { data: { type: 'users', id: username } },
            tag: { data: { type: 'tags', id: tagname } }
          }
        },
        included: [
          { type: 'users', id: username, attributes: { givenName: '' } },
          { type: 'tags', id: tagname }
        ]
      });

      const userTag = await updateUserTagPromise;
      expect(userTag).toEqual({ user: { username, givenName: '' }, tag: { tagname }, story, relevance });
    }));

  });

  describe('removeUserTag(username, tagname)', () => {

    it('should remove tag from user', async(async () => {

      const username = 'user1';
      const tagname = 'tag4';

      // execute the function
      const removeUserTagPromise = service.removeUserTag(username, tagname);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/users/${username}/tags/${tagname}`);

      expect(req.request.method).toEqual('DELETE');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush('', { status: 204, statusText: 'No Content' });

      await removeUserTagPromise;
    }));
  });

  describe('readAvatar(username, size=128, cache=true)', () => {

    it('should read the default svg avatar of user', async(async () => {

      const username = 'user1';

      // execute the function
      const readAvatarPromise = service.readAvatar(username);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/users/${username}/avatar?filter[size]=128`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush(b64ToBlob(btoa('<svg></svg>'), 'image/svg+xml'));

      const avatar = await readAvatarPromise;
      expect(avatar).toMatch(/^data:image\/svg\+xml;base64/);
    }));

    it('should read a uploaded jpeg avatar of user', async(async () => {

      const username = 'user1';

      // execute the function
      const readAvatarPromise = service.readAvatar(username);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/users/${username}/avatar?filter[size]=128`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush(b64ToBlob(btoa('AAAA'), 'image/jpeg'));

      const avatar = await readAvatarPromise;
      expect(avatar).toMatch(/^data:image\/jpeg;base64/);
    }));

    it('can specify the avatar size', async(async () => {

      const username = 'user1';

      // execute the function with specific size
      const readAvatarPromise = service.readAvatar(username, 64);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/users/${username}/avatar?filter[size]=64`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush(b64ToBlob(btoa('AAAA'), 'image/jpeg'));

      const avatar = await readAvatarPromise;
      expect(avatar).toMatch(/^data:image\/jpeg;base64/);
    }));

    it('cache the avatars', async(async () => {
      const username = 'user1';

      // execute the function
      service.readAvatar(username);

      // mock the backend
      httpMock.expectOne(`${baseUrl}/users/${username}/avatar?filter[size]=128`);

      // execute the function again
      service.readAvatar(username);

      // and backend shouldn't be called
      httpMock.expectNone(`${baseUrl}/users/${username}/avatar?filter[size]=128`);

    }));

    it('don\'t cache the avatars when disabled', async(async () => {
      const username = 'user1';

      // execute the function
      service.readAvatar(username, 64, false);

      // mock the backend
      httpMock.expectOne(`${baseUrl}/users/${username}/avatar?filter[size]=64`);

      // execute the function again
      service.readAvatar(username, 64, false);

      // and backend should be called again
      httpMock.expectOne(`${baseUrl}/users/${username}/avatar?filter[size]=64`);

    }));
  });

  describe('readTag(tagname)', () => {

    it('should read a tag', async(async () => {

      const tagname = 'tag1';

      // execute the function
      const readTagPromise = service.readTag(tagname);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/tags/${tagname}`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({ data: {
        type: 'tags',
        id: tagname
      } });

      const tag = await readTagPromise;
      expect(tag).toEqual({ tagname });
    }));
  });

  describe('findUsersByTags(Tag[])', () => {

    it('should find users with userTags', async(async () => {

      const tags: Tag[] = [{ tagname: 'tag0' }, { tagname: 'tag1' }, { tagname: 'tag3' }];
      const tagString = tags.map(tag => tag.tagname).join(',');
      // execute the function
      const findUsersByTagsPromise = service.findUsersByTags(tags);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/users?filter[tag]=${tagString}`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({ data: [
        {
          type: 'users',
          id: 'user1',
          relationships: {
            tags: {
              data: [{
                type: 'user-tags',
                id: 'user1--tag1'
              }]
            }
          }
        }
      ], included: [
        { type: 'tags', id: 'tag1' },
        { type: 'users', id: 'user1' },
        { type: 'user-tags', id: 'user1--tag1',
          attributes: {
            story: '', relevance: 3
          },
          relationships: {
            user: { data: { type: 'users', id: 'user1' } },
            tag: { data: { type: 'tags', id: 'tag1' } }
          }
        }
      ] });

      const users = await findUsersByTagsPromise;
      expect(users).toEqual([{
        username: 'user1',
        userTags: [
          { user: { username: 'user1' }, tag: { tagname: 'tag1' }, story: '', relevance: 3 }
        ]
      }]);
    }));
  });

  describe('findUsersByMyTags()', () => {

    it('should find users with userTags', async(async () => {

      // execute the function
      const findUsersByMyTagsPromise = service.findUsersByMyTags();

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/users?filter[byMyTags]`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({ data: [
        {
          type: 'users',
          id: 'user1',
          relationships: {
            tags: {
              data: [{
                type: 'user-tags',
                id: 'user1--tag1'
              }]
            }
          }
        }
      ], included: [
        { type: 'tags', id: 'tag1' },
        { type: 'user-tags', id: 'user1--tag1',
          attributes: {
            story: '', relevance: 3
          },
          relationships: {
            user: { data: { type: 'users', id: 'user1' } },
            tag: { data: { type: 'tags', id: 'tag1' } }
          }
        }
      ] });

      const users = await findUsersByMyTagsPromise;
      expect(users).toEqual([{
        username: 'user1',
        userTags: [
          { user: { username: 'user1' }, tag: { tagname: 'tag1' }, story: '', relevance: 3 }
        ]
      }]);
    }));
  });

  describe('findUsersWithinRectangle', () => {
    it('should find users', () => {

      // execute the function
      service.findUsersWithinRectangle({ lat: -5, lng: -5 }, { lat: 5, lng: 5 }).subscribe(data => {
        expect(data.length).toEqual(3);
      });

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/users?filter[location]=-5,-5,5,5`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: [
          { type: 'users', id: 'user1', attributes: {} },
          { type: 'users', id: 'user3', attributes: {} },
          { type: 'users', id: 'user2', attributes: {} },
        ]
      });
    });
  });

  describe('readMessagesWith(username)', () => {

    it('should read messages with user', async(async () => {

      // usernames
      const me = 'user-me';
      const other = 'other-user';

      // execute the function
      const readMessagesWithPromise = service.readMessagesWith(other);


      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/messages?filter[with]=${other}`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({ data: [
        {
          type: 'messages',
          id: '1',
          attributes: {
            body: 'msg body',
            created: 123456,
            read: true
          },
          relationships: {
            from: {
              data: {
                type: 'users',
                id: me
              }
            },
            to: {
              data: {
                type: 'users',
                id: other
              }
            }
          }
        }
      ], included: [
        { type: 'users', id: me, attributes: {} },
        { type: 'users', id: other, attributes: {} }
      ] });

      const messages = await readMessagesWithPromise;
      expect(messages).toEqual([new Message({
        body: 'msg body',
        created: 123456,
        read: true,
        from: { username: me },
        to: { username: other },
        id: '1'
      })]);
    }));
  });

  describe('readThreads()', () => {

    it('should read last messages in latest active threads', async(async () => {

      // usernames
      const me = 'user-me';
      const other = 'other-user';

      // execute the function
      const readThreadsPromise = service.readThreads();


      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/messages?filter[threads]`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({ data: [
        {
          type: 'messages',
          id: '1',
          attributes: {
            body: 'msg body',
            created: 123456,
            read: true
          },
          relationships: {
            from: {
              data: {
                type: 'users',
                id: me
              }
            },
            to: {
              data: {
                type: 'users',
                id: other
              }
            }
          }
        }
      ], included: [
        { type: 'users', id: me, attributes: {} },
        { type: 'users', id: other, attributes: {} }
      ] });

      const messages = await readThreadsPromise;
      expect(messages).toEqual([new Message({
        body: 'msg body',
        created: 123456,
        read: true,
        from: { username: me },
        to: { username: other },
        id: '1'
      })]);
    }));
  });

  describe('sendMessage(username, { body })', () => {

    it('should send a message to a user', async(async () => {

      // usernames
      const me = 'user-me';
      const other = 'other-user';

      // execute the function
      const sendMessagePromise = service.sendMessage(other, { body: 'msg body' });


      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/messages`);

      expect(req.request.method).toEqual('POST');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({ data: {
        type: 'messages',
        id: '1',
        attributes: {
          body: 'msg body',
          created: 123456,
          read: true
        },
        relationships: {
          from: {
            data: {
              type: 'users',
              id: me
            }
          },
          to: {
            data: {
              type: 'users',
              id: other
            }
          }
        }
      }, included: [
        { type: 'users', id: me, attributes: {} },
        { type: 'users', id: other, attributes: {} }
      ] });

      const message = await sendMessagePromise;
      expect(message).toEqual(new Message({
        body: 'msg body',
        created: 123456,
        read: true,
        from: { username: me },
        to: { username: other },
        id: '1'
      }));
    }));
  });

  describe('updateMessageToRead(Message)', () => {

    /**
     * the API request updates to read the given message
     * (if it is received and unread)
     * and all received unread messages that are older than the given message.
     */

    it('should mark a message as read', async(async () => {

      // usernames
      const me = 'user-me';
      const other = 'other-user';
      const id = '111';

      // execute the function
      const updateMessageToReadPromise = service.updateMessageToRead({ id });


      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/messages/${id}`);

      expect(req.request.method).toEqual('PATCH');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      // api responds with array of updated messages
      req.flush({ data: [{
        type: 'messages',
        id: '1',
        attributes: {
          body: 'msg body',
          created: 123456,
          read: true
        },
        relationships: {
          from: {
            data: {
              type: 'users',
              id: other
            }
          },
          to: {
            data: {
              type: 'users',
              id: me
            }
          }
        }
      }] });

      const updatedMessages = await updateMessageToReadPromise;

      expect(updatedMessages).toEqual([new Message({
        body: 'msg body',
        created: 123456,
        read: true,
        from: { username: other },
        to: { username: me },
        id: '1'
      })]);
    }));
  });

  describe('countUnreadMessages', () => {
    it('should find users', () => {

      // execute the function
      service.countUnreadMessages().subscribe(data => {
        expect(data).toEqual(3);
      });

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/messages?filter[count]`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        meta: {
          unread: 3
        }
      });
    });
  });

  describe('requestResetPassword(usernameOrEmail)', () => {
    it('should make a correct request', async(async () => {

      const username = 'user1';
      const email = `${username}@example.com`;

      // execute the function
      const requestResetPasswordPromise = service.requestResetPassword(email);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/account?reset-password`);

      expect(req.request.method).toEqual('PATCH');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(false);

      req.flush('');

      await requestResetPasswordPromise;
    }));
  });

  describe('resetPassword(username, password, code)', () => {
    it('should make a correct request', async(async () => {

      const username = 'user1';
      const password = 'password';
      const code = 'code';

      // execute the function
      const resetPasswordPromise = service.resetPassword(username, password, code);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/account`);

      expect(req.request.method).toEqual('PATCH');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(false);

      req.flush('');

      await resetPasswordPromise;
    }));
  });

  describe('changeEmail(username, email, password)', () => {
    it('should make a correct request', async(async () => {

      const username = 'user1';
      const email = 'user1@example.com';
      const password = 'password';

      // execute the function
      const changeEmailPromise = service.changeEmail(username, email, password);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/account`);

      expect(req.request.method).toEqual('PATCH');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush('');

      await changeEmailPromise;
    }));
  });

  describe('sendContactRequestTo(username, { message, trust, reference })', () => {
    it('should make a correct request', async(async () => {

      const username = 'user1';
      const contact = { message: 'hello', trust: 3, reference: 'friend' };

      // execute the function
      const sendContactRequestToPromise = service.sendContactRequestTo(username, contact);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/contacts`);

      expect(req.request.method).toEqual('POST');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);
      expect(req.request.body).toEqual({
        data: {
          type: 'contacts',
          attributes: contact,
          relationships: { to: { data: { type: 'users', id: username } } }
        }
      });

      req.flush({
        data: {
          type: 'contacts',
          id: `me--${username}`,
          attributes: {
            isConfirmed: false,
            created: Date.now(),
            reference: contact.reference,
            trust: contact.trust
          },
          relationships: {
            from: { data: { type: 'users', id: 'me' } },
            to: { data: { type: 'users', id: username } }
          }
        }
      });

      await sendContactRequestToPromise;
    }));
  });

  describe('updateContactWith(username, { message?, trust?, reference?, isConfirmed? })', () => {
    it('should make a correct request', async(async () => {

      const username = 'user1';
      const contact = { trust: 2, reference: 'friend', isConfirmed: true };

      // execute the function
      const updateContactWithPromise = service.updateContactWith(username, contact);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/contacts/test/${username}`);

      expect(req.request.method).toEqual('PATCH');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);
      expect(req.request.body).toEqual({
        data: {
          type: 'contacts',
          id: `test--${username}`,
          attributes: contact
        }
      });

      req.flush({
        data: {
          type: 'contacts',
          id: `me--${username}`,
          attributes: contact,
          relationships: {
            from: { data: { type: 'users', id: 'test' } },
            to: { data: { type: 'users', id: username } }
          }
        }
      });

      await updateContactWithPromise;
    }));
  });

  describe('deleteContactWith(username)', () => {
    it('should make a correct request', async(async () => {

      const username = 'user1';

      // execute the function
      const deleteContactWithPromise = service.deleteContactWith(username);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/contacts/test/${username}`);

      expect(req.request.method).toEqual('DELETE');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush('');

      await deleteContactWithPromise;
    }));
  });

  describe('confirmContactRequestFrom(username, { message?, trust?, reference?, isConfirmed? })', () => {
    it('should make a correct request', async(async () => {

      const username = 'user1';
      const contact = { trust: 2, reference: 'friend', isConfirmed: true };

      // execute the function
      const confirmContactRequestFromPromise = service.confirmContactRequestFrom(username, contact);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/contacts/test/${username}`);

      expect(req.request.method).toEqual('PATCH');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);
      expect(req.request.body).toEqual({
        data: {
          type: 'contacts',
          id: `test--${username}`,
          attributes: contact
        }
      });

      req.flush({
        data: {
          type: 'contacts',
          id: `me--${username}`,
          attributes: contact,
          relationships: {
            from: { data: { type: 'users', id: 'test' } },
            to: { data: { type: 'users', id: username } }
          }
        }
      });

      await confirmContactRequestFromPromise;
    }));
  });

  describe('readContactsTo(username)', () => {
    it('should make a correct request', async(async () => {

      const username = 'user-to';

      // execute the function
      const readContactsToPromise = service.readContactsTo(username);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/contacts?filter[to]=${username}`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: [
          {
            type: 'contacts',
            id: `user1--${username}`,
            attributes: {
              isConfirmed: true,
              created: 123,
              confirmed: 123,
              trust: 2,
              reference: 'ref1'
            },
            relationships: {
              from: { data: { type: 'users', id: 'user1' } },
              to: { data: { type: 'users', id: username } },
              creator: { data: { type: 'users', id: 'user1' } }
            },
          },
          {
            type: 'contacts',
            id: `user2--${username}`,
            attributes: {
              isConfirmed: true,
              created: 123,
              confirmed: 123,
              trust: 4,
              reference: 'ref2'
            },
            relationships: {
              from: { data: { type: 'users', id: 'user2' } },
              to: { data: { type: 'users', id: username } },
              creator: { data: { type: 'users', id: username } }
            },
          }
        ],
        included: [
          { type: 'users', id: username, attributes: {} },
          { type: 'users', id: 'user1', attributes: {} },
          { type: 'users', id: 'user2', attributes: {} },
        ]
      });

      const contacts = await readContactsToPromise;
      expect(contacts).toEqual([
        new Contact({
          from: { username: 'user1' },
          to: { username },
          creator: { username: 'user1' },
          isConfirmed: true,
          trust: 2, reference: 'ref1', created: 123, confirmed: 123
        }),
        new Contact({
          from: { username: 'user2' },
          to: { username },
          creator: { username },
          isConfirmed: true,
          trust: 4, reference: 'ref2', created: 123, confirmed: 123
        })
      ]);
    }));
  });

  describe('readContact(from, to)', () => {
    it('should make a correct request', async(async () => {

      const from = 'user-from';
      const to = 'user-to';

      // execute the function
      const readContactPromise = service.readContact(from, to);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/contacts/${from}/${to}`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: {
          type: 'contacts',
          id: `${from}--${to}`,
          attributes: {
            isConfirmed: true,
            created: 123,
            confirmed: 123,
            trust: 2,
            reference: 'ref1'
          },
          relationships: {
            from: { data: { type: 'users', id: from } },
            to: { data: { type: 'users', id: to } },
            creator: { data: { type: 'users', id: to } }
          },
        },
        included: [
          { type: 'users', id: from, attributes: {} },
          { type: 'users', id: to, attributes: {} },
        ]
      });

      const contacts = await readContactPromise;

      expect(contacts).toEqual(new Contact({
        from: { username: from },
        to: { username: to },
        creator: { username: to },
        isConfirmed: true,
        trust: 2, reference: 'ref1', created: 123, confirmed: 123
      }));
    }));
  });

  describe('createIdea(Idea)', () => {
    it('should create idea and return the new idea', async(async () => {

      // execute the function
      const createIdeaPromise = service.createIdea({ title: 'test', detail: 'test detail' });
      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/ideas`);

      expect(req.request.method).toEqual('POST');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      expect(req.request.body).toEqual({
        data: {
          type: 'ideas',
          attributes: {
            title: 'test',
            detail: 'test detail'
          }
        }
      });

      req.flush({
        data: {
          type: 'ideas',
          id: '0011223344',
          attributes: {
            title: 'test',
            detail: 'test detail',
            created: 1234567890000
          },
          relationships: {
            creator: {
              data: {
                type: 'users', id: 'test-user'
              }
            }
          }
        }
      });

      const newIdea = await createIdeaPromise;

      expect(newIdea).toEqual({
        id: '0011223344',
        title: 'test',
        detail: 'test detail'
      });
    }));
  });

  describe('readIdea(id)', () => {
    it('should read the idea', async(async () => {

      const ideaId = '11223344';
      // execute the function
      const readIdeaPromise = service.readIdea(ideaId);
      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/ideas/${ideaId}`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: {
          type: 'ideas',
          id: ideaId,
          attributes: {
            title: 'test',
            detail: 'test detail',
            created: 1234567890000
          },
          relationships: {
            creator: {
              data: {
                type: 'users', id: 'test-user'
              }
            }
          },
          meta: {
            votesUp: 5,
            votesDown: 3,
            myVote: 0
          }
        },
        included: [
          {
            type: 'users',
            id: 'test-user',
            attributes: {
              username: 'test-user'
            }
          }
        ]
      });

      const foundIdea = await readIdeaPromise;

      expect(foundIdea).toEqual({
        id: ideaId,
        title: 'test',
        detail: 'test detail',
        creator: {
          username: 'test-user'
        },
        votes: { up: 5, down: 3, me: 0 }
      });
    }));
  });

  describe('updateIdea(Idea)', () => {
    it('should update idea and return the updated idea', async(async () => {

      const id = '11223344';
      // execute the function
      const updateIdeaPromise = service.updateIdea({ id, title: 'test', detail: 'updated test detail' });
      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/ideas/${id}`);

      expect(req.request.method).toEqual('PATCH');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      expect(req.request.body).toEqual({
        data: {
          type: 'ideas',
          id,
          attributes: {
            title: 'test',
            detail: 'updated test detail'
          }
        }
      });

      req.flush({
        data: {
          type: 'ideas',
          id,
          attributes: {
            title: 'test',
            detail: 'test detail',
            created: 1234567890000
          },
          relationships: {
            creator: {
              data: {
                type: 'users', id: 'test-user'
              }
            }
          }
        }
      });

      const updatedIdea = await updateIdeaPromise;

      expect(updatedIdea).toEqual({
        id,
        title: 'test',
        detail: 'test detail'
      });
    }));
  });

  describe('readIdeaTags(ideaId)', () => {
    it('should update idea and return the updated idea', async(async () => {
      // execute the function
      const readIdeaTagsPromise = service.readIdeaTags('111222333');
      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/ideas/111222333/tags`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: [
          {
            type: 'idea-tags',
            id: '111222333--tag0',
            relationships: { tag: { data: { type: 'tags', id: 'tag0' } } }
          },
          {
            type: 'idea-tags',
            id: '111222333--tag1',
            relationships: { tag: { data: { type: 'tags', id: 'tag1' } } }
          }
        ]
      });

      const ideaTags = await readIdeaTagsPromise;

      expect(ideaTags.length).toEqual(2);
    }));
  });

  describe('addIdeaTag(ideaId, tagname)', () => {
    it('should update idea and return the updated idea', async(async () => {

      const id = '11223344';
      const tagname = 'test-tag';

      // execute the function
      const addIdeaTagPromise = service.addIdeaTag(id, tagname);
      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/ideas/${id}/tags`);

      expect(req.request.method).toEqual('POST');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      expect(req.request.body).toEqual({
        data: {
          type: 'idea-tags',
          relationships: {
            tag: {
              data: { type: 'tags', id: tagname }
            }
          }
        }
      });

      req.flush({
        data: {
          type: 'idea-tags',
          id: `${id}--${tagname}`,
          relationships: {
            creator: {
              data: { type: 'users', id: 'test-user' }
            },
            idea: {
              data: { type: 'ideas', id }
            },
            tag: {
              data: { type: 'tags', id: tagname }
            }
          }
        }
      });

      const addedTag = await addIdeaTagPromise;

      expect(addedTag).toEqual({ tagname });

    }));
  });

  describe('removeIdeaTag(ideaId, tagname)', () => {
    it('should update idea and return the updated idea', async(async () => {

      const id = '11223344';
      const tagname = 'test-tag';
      // execute the function
      const removeIdeaTagPromise = service.removeIdeaTag(id, tagname);
      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/ideas/${id}/tags/${tagname}`);

      expect(req.request.method).toEqual('DELETE');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush('', { status: 204, statusText: 'No Content' });

      await removeIdeaTagPromise;
    }));
  });

  describe('findIdeasWithMyTags()', () => {
    it('should update idea and return the updated idea', async(async () => {
      // execute the function
      const findIdeasPromise = service.findIdeasWithMyTags();
      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/ideas?filter[withMyTags]`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: [
          {
            type: 'ideas',
            id: '112233',
            attributes: {
              title: 'idea1',
              detail: 'idea detail'
            },
            relationships: {
              creator: { data: { type: 'users', id: 'user1' } },
              ideaTags: { data: [
                { type: 'idea-tags', id: '112233--tag0' },
                { type: 'idea-tags', id: '112233--tag1' },
                { type: 'idea-tags', id: '112233--tag2' }
              ] }
            }
          }
        ],
        included: [
          { type: 'users', id: 'user1', attributes: { username: 'user1' } },
          { type: 'idea-tags', id: '112233--tag0', relationships: {
            tag: { data: { type: 'tags', id: 'tag0' } }
          } },
          { type: 'idea-tags', id: '112233--tag1', relationships: {
            tag: { data: { type: 'tags', id: 'tag1' } }
          } },
          { type: 'idea-tags', id: '112233--tag2', relationships: {
            tag: { data: { type: 'tags', id: 'tag2' } }
          } }
        ]
      });

      const foundIdeas = await findIdeasPromise;

      expect(foundIdeas).toEqual([{
        id: '112233',
        title: 'idea1',
        detail: 'idea detail',
        creator: { username: 'user1' },
        tags: [{ tagname: 'tag0' }, { tagname: 'tag1' }, { tagname: 'tag2' }]
      }]);
    }));
  });

  describe('findNewIdeas()', () => {
    it('should update idea and return the updated idea', async(async () => {
      // execute the function
      const findIdeasPromise = service.findNewIdeas();
      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/ideas?sort=-created`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: [
          {
            type: 'ideas',
            id: '112233',
            attributes: {
              title: 'idea1',
              detail: 'idea detail'
            },
            relationships: {
              creator: { data: { type: 'users', id: 'user1' } }
            }
          }
        ],
        included: [
          { type: 'users', id: 'user1', attributes: { username: 'user1' } }
        ]
      });

      const foundIdeas = await findIdeasPromise;

      expect(foundIdeas).toEqual([{
        id: '112233',
        title: 'idea1',
        detail: 'idea detail',
        creator: { username: 'user1' }
      }]);
    }));
  });

  describe('addCommentTo({ type, id }, comment)', () => {
    it('should add comment to idea or other dit object', async(async () => {
      // execute the function
      const addCommentPromise = service.addCommentTo({ type: 'ideas', id: '111222333' }, { content: 'comment content' });
      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/ideas/111222333/comments`);

      expect(req.request.method).toEqual('POST');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      expect(req.request.body).toEqual({
        data: {
          type: 'comments',
          attributes: {
            content: 'comment content'
          }
        }
      });

      req.flush({
        data: {
          type: 'comments',
          id: '112233',
          attributes: {
            content: 'comment content',
            created: 1234
          },
          relationships: {
            creator: { data: { type: 'users', id: 'user1' } },
            primary: { data: { type: 'ideas', id: '00001' } }
          }
        },
        included: [
          { type: 'users', id: 'user1', attributes: { username: 'user1' } }
        ]
      });

      const newComment = await addCommentPromise;

      expect(newComment).toEqual({
        id: '112233',
        content: 'comment content',
        created: 1234,
        creator: { username: 'user1' }
      });
    }));
  });

  describe('readCommentsOf({ type, id })', () => {
    it('should update idea and return the updated idea', async(async () => {
      // execute the function
      const readCommentsPromise = service.readCommentsOf({ type: 'ideas', id: '111' });
      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/ideas/111/comments`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: [
          {
            type: 'comments',
            id: '112233',
            attributes: {
              content: 'comment content',
              created: 1234
            },
            relationships: {
              creator: { data: { type: 'users', id: 'user1' } },
              primary: { data: { type: 'ideas', id: '111' } }
            }
          }
        ],
        included: [
          { type: 'users', id: 'user1', attributes: { username: 'user1' } }
        ]
      });

      const foundComments = await readCommentsPromise;

      expect(foundComments).toEqual([{
        id: '112233',
        content: 'comment content',
        created: 1234,
        creator: { username: 'user1' }
      }]);
    }));
  });

  describe('updateComment({ id, content })', () => {
    it('should edit the comment and return the edited', async(async () => {
      // execute the function
      const updateCommentPromise = service.updateComment({ id: '111222333', content: 'comment content' });
      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/comments/111222333`);

      expect(req.request.method).toEqual('PATCH');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      expect(req.request.body).toEqual({
        data: {
          type: 'comments',
          id: '111222333',
          attributes: {
            content: 'comment content'
          }
        }
      });

      req.flush({
        data: {
          type: 'comments',
          id: '111222333',
          attributes: {
            content: 'comment content',
            created: 1234
          },
          relationships: {
            creator: { data: { type: 'users', id: 'user1' } },
            primary: { data: { type: 'ideas', id: '00001' } }
          }
        },
        included: [
          { type: 'users', id: 'user1', attributes: { username: 'user1' } }
        ]
      });

      const updatedComment = await updateCommentPromise;

      expect(updatedComment).toEqual({
        id: '111222333',
        content: 'comment content',
        created: 1234,
        creator: { username: 'user1' }
      });
    }));
  });

  describe('deleteComment(id)', () => {
    it('should remove a comment', async(async () => {
      // execute the function
      const deleteCommentPromise = service.deleteComment('111222333');
      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/comments/111222333`);

      expect(req.request.method).toEqual('DELETE');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush(null);

      const deletedComment = await deleteCommentPromise;

      expect(deletedComment).toEqual(undefined);
    }));
  });

  describe('findIdeasWithTags(Tag[]): Idea[]', () => {
    it('find ideas which have given tags', async(async () => {
      // execute the function
      const findIdeasPromise = service.findIdeasWithTags([{ tagname: 'test' }]);
      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/ideas?filter[withTags]=test`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: [
          {
            type: 'ideas',
            id: '112233',
            attributes: {
              title: 'idea1',
              detail: 'idea detail'
            },
            relationships: {
              creator: { data: { type: 'users', id: 'user1' } }
            }
          }
        ],
        included: [
          { type: 'users', id: 'user1', attributes: { username: 'user1' } }
        ]
      });

      const foundIdeas = await findIdeasPromise;

      expect(foundIdeas).toEqual([{
        id: '112233',
        title: 'idea1',
        detail: 'idea detail',
        creator: { username: 'user1' }
      }]);
    }));
  });

  describe('vote({ to: { type, id }, value })', () => {
    it('when value is +1 or -1 add the vote', async(async () => {
      const votePromise = service.vote({ to: { type: 'ideas', id: '123456'}, value: -1 });
      const req = httpMock.expectOne(`${baseUrl}/ideas/123456/votes`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.headers.has('authorization')).toEqual(true);
      expect(req.request.body).toEqual({
        data: {
          type: 'votes',
          attributes: {
            value: -1
          }
        }
      });

      req.flush({
        data: {
          type: 'votes',
          id: '112233',
          attributes: {
            value: -1,
            created: 1234567890
          }
        }
      });

      await votePromise;
    }));

    it('when value is 0 remove the vote', async(async () => {
      const votePromise = service.vote({ to: { type: 'ideas', id: '123456'}, value: 0 });
      const req = httpMock.expectOne(`${baseUrl}/ideas/123456/votes/vote`);
      expect(req.request.method).toEqual('DELETE');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush(null);

      await votePromise;
    }));
  });

  // verify that there are no outstanding requests remaining
  afterEach(() => {
    httpMock.verify();
  });

});
