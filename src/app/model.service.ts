import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as _ from 'lodash';

import { NewUser } from './new-user';
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

  verifyEmail(username: string, code: string): Promise<string> {
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

    return this.http
      .get(`${this.baseUrl}/users/${username}/account/email/verify/${code}`, { headers })
      .toPromise()
      .then((response) => {
        console.log('responded!', response);
        return 'some-email';
      });
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
         *      tagname,
         *      description
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

  createTag({ tagname, description }: { tagname: string, description: string }): Promise<void> {

    console.log('creating new tag!', tagname, description);

    const requestBody = {
      data: {
        type: 'tags',
        attributes: {
          tagname,
          description
        }
      }
    };

    const headers = this.loggedHeaders;

    return this.http
      .post(`${this.baseUrl}/tags`, JSON.stringify(requestBody), { headers })
      .toPromise()
      .then((response) => {
        console.log('responded!', response);
      });
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
      .map(response => _.map(response.json().data, d => d.attributes));
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

}
