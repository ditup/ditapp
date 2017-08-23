import { TestBed, async, inject } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { FakeBackend } from 'ngx-http-test';

import { ModelService } from './model.service';

import { AuthService } from './auth.service';

import { Tag, UserTag, Message } from './shared/types';

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
      })

      req.flush({ });
      const response = await verifyEmailPromise;
      expect(response).toEqual('some-email');
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

  describe('findRandomTags()', () => {
    it('should success', async(async () => {
      const findRandomTagsPromise = service.findRandomTags();

      const req = httpMock.expectOne(`${baseUrl}/tags?filter[random]`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({
        data: [
          { type: 'tags', id: 'tag3' }
        ]
      });

      const response = await findRandomTagsPromise;
      expect(response.length).toEqual(1);
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
      })
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

      req.flush({
        data: {
          type: 'users',
          id: username
        }
      }, { status: 200, statusText: 'Success' });
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

  describe('basicAuth', () => {
    it('should make a correct request', async(async () => {

      const username = 'user';
      const password = 'password';
      // execute the function
      const basicAuthPromise = service.basicAuth({ username, password });

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/auth/basic`);

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

      const loggedUser = await basicAuthPromise;
      expect(loggedUser).toEqual(jasmine.objectContaining({
        username, givenName: '', familyName: '', description: ''
      }));
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

  describe('isTagnameAvailable', () => {
    it('[tagname exists] should reply false', () => {

      const tagname = 'tag';

      // execute the function
      service.isTagnameAvailable(tagname).subscribe((data) => {
        expect(data).toEqual(false);
      });

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/tags/${tagname}`);

      expect(req.request.method).toEqual('HEAD');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush('');
    });

    it('[tagname doesn\'t exist] should reply true', () => {

      const tagname = 'tag';

      // execute the function
      service.isTagnameAvailable(tagname).subscribe((data) => {
        expect(data).toEqual(true);
      });

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/tags/${tagname}`);

      expect(req.request.method).toEqual('HEAD');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.error('', { status: 404, statusText: 'Not Found' });
    });
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

  describe('readAvatar(username)', () => {

    it('should read the avatar of user', async(async () => {

      const username = 'user1';

      // execute the function
      const readAvatarPromise = service.readAvatar(username);

      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/users/${username}/avatar`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.headers.get('content-type')).toEqual('application/vnd.api+json');
      expect(req.request.headers.has('authorization')).toEqual(true);

      req.flush({ data: {
        type: 'user-avatars',
        id: username,
        attributes: {
          base64: 'aabcde',
          format: 'png'
        }
      } });

      const avatar = await readAvatarPromise;
      expect(avatar.format).toEqual('png');
      expect(avatar.base64).toEqual('aabcde');
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
      const me = 'user-me'
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
      const me = 'user-me'
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
      const me = 'user-me'
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

    it('should mark a message as read', async(async () => {

      // usernames
      const me = 'user-me'
      const other = 'other-user';
      const id = '111'

      // execute the function
      const updateMessageToReadPromise = service.updateMessageToRead({ id });


      // mock the backend
      const req = httpMock.expectOne(`${baseUrl}/messages/${id}`);

      expect(req.request.method).toEqual('PATCH');
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

      const message = await updateMessageToReadPromise;
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

  // verify that there are no outstanding requests remaining
  afterEach(() => {
    httpMock.verify();
  });

});
