import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { LatLng } from 'leaflet';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as _ from 'lodash';

import { NewUser } from './new-user';
import { Tag, User, UserTag, Message } from './shared/types';
import { AuthService } from './auth.service';

declare const Buffer; // fixing a weird error (not declared Buffer)

@Injectable()
export class ModelService {

  private baseUrl = 'http://localhost:3000';

  private generateAuthHeader = this.generateBasicAuthHeader;

  private contentTypeHeader = {
    'Content-Type': 'application/vnd.api+json',
  };

  constructor(private http: Http, private auth: AuthService) { }

  createUser(newUser: NewUser): Promise<void> {
    console.log('creating new user!', newUser);
    const requestBody = {
      data: {
        type: 'users',
        attributes: {
          username: newUser.username,
          email: newUser.email,
          password: newUser.password
        }
      }
    };

    const headers = new Headers({ 'Content-Type': 'application/vnd.api+json' });

    return this.http
      .post(`${this.baseUrl}/users`, JSON.stringify(requestBody), { headers })
      .toPromise()
      .then((response) => {
        console.log('responded!', response);
      });
  }

  private get loggedHeaders() {
    return new Headers(_.extend({}, this.authHeader, this.contentTypeHeader));
  }

  /**
   * @TODO this function is hugely imperfect. we don't know how to work with Observables catch etc
   *
   *
   */
  isUsernameAvailable(username: string): Observable<boolean> {
    console.log('searching for availability of', username);

    const headers = new Headers({ 'Content-Type': 'application/vnd.api+json' });

    return this.http
      .get(`${this.baseUrl}/users/${username}`, { headers })
      .map((resp: Response) => {
        if (resp.status === 200) { return false; }
      })
      .catch((err, observable): Observable<boolean> => {
        if (err.status === 404) { return new Observable(observer => observer.next(true)); }
      });
  }

  async verifyEmail(username: string, code: string): Promise<string> {

    const requestBody = {
      data: {
        type: 'users',
        id: username,
        attributes: {
          username: username,
          code: code
        }
      }
    };

    const headers = new Headers({ 'Content-Type': 'application/vnd.api+json' });

    const response = await this.http
      .get(`${this.baseUrl}/users/${username}/account/email/verify/${code}`, { headers })
      .toPromise();

    console.log('responded!', response);

    // TODO send the real email
    return 'some-email';
  }

  private get authHeader() {
    return this.generateAuthHeader();
  }

  private generateBasicAuthHeader() {
    const credentials = this.auth.credentials;
    return this.createBasicAuthHeader(credentials);
  }

  private createBasicAuthHeader({ username, password }: { username: string, password: string }): { Authorization: string } {
    return {
      Authorization: 'Basic ' + new Buffer(`${username}:${password}`).toString('base64')
    };
  }

  basicAuth({ username, password }: { username: string, password: string }): Promise<any> {
    // generate an Authorization header
    const authHeader = this.createBasicAuthHeader({ username, password });

    const headers = new Headers(_.assign({}, authHeader, this.contentTypeHeader));

    return this.http
      .get(`${this.baseUrl}/auth/basic`, { headers })
      .toPromise()
      .then((response: Response) => {
        console.log('responded!', response);
        return response.json().data.attributes;
      });
  }

  readUser(username: string): Promise<any> { // @TODO better return type
    console.log('reading user', username);

    const headers = new Headers(_.extend({}, this.authHeader, this.contentTypeHeader));

    return this.http
      .get(`${this.baseUrl}/users/${username}`, { headers })
      .toPromise()
      .then((response: Response) => {
        return response.json().data.attributes;
      });
  }

  updateUser(username: string, profile: { givenName?: string, familyName?: string, description?: string}): Promise<any> {
    console.log('updating the user!', username, profile);
    const requestBody = {
      data: {
        type: 'users',
        id: username,
        attributes: profile
      }
    };

    const headers = new Headers(_.extend({}, this.authHeader, this.contentTypeHeader));

    return this.http
      .patch(`${this.baseUrl}/users/${username}`, JSON.stringify(requestBody), { headers })
      .toPromise()
      .then((response: Response) => {
        return response.json().data.attributes;
      });
  }

  /**
   * Get user-tags of a given user from API
   * @param {string} username: what user's tags we search
   * @returns {Promise<UserTag>} array of formatted userTags
   */
  readUserTags(username: string): Promise<any> {
    const headers = new Headers(_.extend({}, this.authHeader, this.contentTypeHeader));

    // send a request to the REST API
    return this.http
      .get(`${this.baseUrl}/users/${username}/tags`, { headers })
      .toPromise()
      .then((response: Response) => {
        // response should contain an array of user-tags (data) and also an array
        // of related tags (included)
        const { data, included }: { data: any[], included: any[] } = response.json();

        // we map user-tags to a simpler structure
        /* TODO improve?
         *  {
         *    tagname,
         *    story,
         *    tag: { // the included tag
         *      tagname
         *    }
         *  }
         */
        const deserialized = _.map(data, (tag: { attributes: any, relationships: any }) => {
          const tagDeserialized = tag.attributes;

          // find the tag in included array
          const tagname = tag.relationships.tag.data.id; // get tagname
          // search the tagname in included[]
          const includedTag = _.find(included, (element) => {
            return element.type === 'tags' && element.id === tagname;
          });

          tagDeserialized.tag = includedTag.attributes;

          return tagDeserialized;

        });

        return deserialized;
      });
  }

  async createTag({ tagname }: Tag): Promise<void> {

    const requestBody = {
      data: {
        type: 'tags',
        attributes: {
          tagname
        }
      }
    };

    const headers = this.loggedHeaders;

    const response: Response = await this.http
      .post(`${this.baseUrl}/tags`, JSON.stringify(requestBody), { headers })
      .toPromise();

    console.log('responded!', response.json());
  }

  /**
   * @TODO this function is hugely imperfect. we don't know how to work with Observables catch etc
   *
   *
   */
  isTagnameAvailable(tagname: string): Observable<boolean> {
    console.log('searching for availability of', tagname);

    const headers = this.loggedHeaders;

    return this.http
      .head(`${this.baseUrl}/tags/${tagname}`, { headers })
      .map((resp: Response) => {
        if (resp.status === 200) { return false; }
      })
      .catch((err, observable): Observable<boolean> => {
        if (err.status === 404) {
          return new Observable(observer => observer.next(true));
        }

        throw err;
      });
  }

  addTagToUser({ username, tagname, relevance, story }:
               { username: string, tagname: string, relevance?: number, story?: string }): Promise<any> {

    // defaults

    relevance = relevance || 3;
    story = story || '';

    console.log('adding tag', tagname, 'to user', username);

    const headers = this.loggedHeaders;

    const requestBody = {
      data: {
        type: 'user-tags',
        id: `${username}--${tagname}`,
        attributes: {
          username,
          tagname,
          relevance,
          story
        }
      }
    };

    return this.http
      .post(`${this.baseUrl}/users/${username}/tags`, JSON.stringify(requestBody), { headers })
      .toPromise()
      .then((response: Response) => {
        console.log('responded!', response);
        return response.json().data.attributes;
      });

  }

  readTagsLike(value: string): Observable<any[]> {

    console.log('searching tags like', value);

    const headers = this.loggedHeaders;

    return this.http
      .get(`${this.baseUrl}/tags?filter${encodeURIComponent('[tagname][like]')}=${encodeURIComponent(value)}`, { headers })
      .map(response => _.map(response.json().data, (d: any) => d.attributes));
  }

  updateUserTag(username: string, tagname: string, data: { story?: string, relevance?: number}): Promise<any> {
    console.log('updating user-tag', username, tagname);
    const requestBody = {
      data: {
        type: 'users',
        id: `${username}--${tagname}`,
        attributes: data
      }
    };

    const headers = this.loggedHeaders;

    return this.http
      .patch(`${this.baseUrl}/users/${username}/tags/${tagname}`, JSON.stringify(requestBody), { headers })
      .toPromise()
      .then((response: Response) => {
        const data = response.json().data;

      });
  }

  removeUserTag(username: string, tagname: string): Promise<any> {

    console.log('removing tag', tagname, 'from user', username);

    const headers = this.loggedHeaders;

    return this.http
      .delete(`${this.baseUrl}/users/${username}/tags/${tagname}`, { headers })
      .toPromise()
      .then((response: Response) => {
        console.log('responded!', response);
        return response;
      });

  }

  readAvatar(username: string): Promise<any> {
    const headers = this.loggedHeaders;

    return this.http
      .get(`${this.baseUrl}/users/${username}/avatar`, { headers })
      .toPromise()
      .then((response: Response) => {
        const data = response.json().data;
        return data.attributes;
      });
  }

  readTag(tagname: string): Promise<Tag> {
    const headers = this.loggedHeaders;

    return this.http
      .get(`${this.baseUrl}/tags/${tagname}`, { headers })
      .toPromise()
      .then((response: Response) => {
        const data = response.json().data;
        return data.attributes;
      });
  }

  async tagExists(tagname: string): Promise<boolean> {
    const isValid: boolean = (function (tagname: string): boolean {
      const isSizeValid = tagname.length >= 1 && tagname.length <= 64;
      const isNameValid = /^[a-z0-9]+(\-[a-z0-9]+)*$/.test(tagname);

      return isSizeValid && isNameValid;

    }(tagname));

    if (!isValid) {
      return false;
    }

    const headers = this.loggedHeaders;

    try {
      const { status } = await this.http
        .head(`${this.baseUrl}/tags/${tagname}`, { headers })
        .toPromise();

      if (status === 200)
        return true;

      throw new Error(`Unexpected success status ${status}`);

    } catch (e) {
      const { status } = e;

      if (status === 404) {
        return false;
      }

      throw e;
    }
  }

  public async findUsersByTags(tagnames: string[]) {
    const headers = this.loggedHeaders;

    const tagnamesJoined: string = tagnames.join(',');

    const response: Response = await this.http
      .get(`${this.baseUrl}/users?filter${encodeURIComponent('[tag]')}=${encodeURIComponent(tagnamesJoined)}`, { headers })
      .toPromise();

    const responseJson = response.json();
    const data = responseJson.data;
    const included = responseJson.included;

    const users: User[] = _.map(data, (userData: any) => {

      const user = userData.attributes as User;
      user.userTags = [];

      _.each(userData.relationships.tags.data, (userTagRel: any) => {
        const userTagData = _.find(included, (userTag: any) => {
          return userTag.type === 'user-tags' && userTag.id === userTagRel.id;
        });

        const userTag = userTagData.attributes as UserTag;

        const tagData = _.find(included, (tag: any) => {
          const tagRel = userTagData.relationships.tag.data;
          return tag.type === 'tags' && tag.id === tagRel.id;
        });

        userTag.tag = tagData.attributes as Tag;

        user.userTags.push(userTag);

      });

      return user;
    });

    return users;
  }

  public async findUsersByMyTags() {
    const headers = this.loggedHeaders;

    const response: Response = await this.http
      .get(`${this.baseUrl}/users?filter${encodeURIComponent('[byMyTags]')}=true`, { headers })
      .toPromise();

    const responseJson = response.json();
    const data = responseJson.data;
    const included = responseJson.included;

    const users: User[] = _.map(data, (userData: any) => {

      const user = userData.attributes as User;
      user.userTags = [];

      _.each(userData.relationships.tags.data, (userTagRel: any) => {
        const userTagData = _.find(included, (userTag: any) => {
          return userTag.type === 'user-tags' && userTag.id === userTagRel.id;
        });

        const userTag = userTagData.attributes as UserTag;

        const tagData = _.find(included, (tag: any) => {
          const tagRel = userTagData.relationships.tag.data;
          return tag.type === 'tags' && tag.id === tagRel.id;
        });

        userTag.tag = tagData.attributes as Tag;

        user.userTags.push(userTag);

      });

      return user;
    });

    return users;
  }

  public async findUsersWithinRectangle(sw: LatLng, ne: LatLng): Promise<User[]> {
    const headers = this.loggedHeaders;

    console.log(sw, ne);

    const locationString = `${sw.lat},${sw.lng},${ne.lat},${ne.lng}`;

    const response: Response = await this.http
      .get(`${this.baseUrl}/users?filter${encodeURIComponent('[location]')}=${locationString}`, { headers })
      .toPromise();

    const responseJson = response.json();
    const data = responseJson.data;

    return _.map(data, (user: any) => this.deserializeUser(user));
  }

  public async readMessagesWith(username: string): Promise<Message[]> {
    const headers = this.loggedHeaders;

    const response: Response = await this.http
      .get(`${this.baseUrl}/messages?filter${encodeURIComponent('[with]')}=${username}`, { headers })
      .toPromise();

    const { data, included } = response.json();

    const messages: Message[] = _.map(data, (msgData: any) => {
      return this.deserializeMessage(msgData, included);
    });

    return messages;
  }

  public async sendMessage(to: string, { body }: { body: string }): Promise<any> {

    const headers = this.loggedHeaders;

    const requestBody = {
      data: {
        type: 'messages',
        attributes: {
          body
        },
        relationships: {
          to: { data: { type: 'users', id: to } }
        }
      }
    };

    const response: Response = await this.http
      .post(`${this.baseUrl}/messages`, JSON.stringify(requestBody), { headers })
      .toPromise();

      console.log('responded!', response.json().data);

      const { data, included } = response.json();

      return this.deserializeMessage(data, included);
  }

  private deserializeMessage(msgData: any, included: any): Message {
    const message = msgData.attributes as Message;

    message.id = msgData.id;

    const fromUsername: string = msgData.relationships.from.data.id;
    const toUsername: string = msgData.relationships.to.data.id;

    const fromData = _.find(included, (user: any) => {
      return user.type === 'users' && user.id === fromUsername;
    });

    const toData = _.find(included, (user: any) => {
      return user.type === 'users' && user.id === toUsername;
    });

    message.from = fromData.attributes as User;
    message.to = toData.attributes as User;

    return message;
  }

  private deserializeUser(userData: any, included?: any): User {
    const user = userData.attributes as User;

    return user;
  }
}
