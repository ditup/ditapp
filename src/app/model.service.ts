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

  readUserTags(username: string): Promise<any> {
    const headers = new Headers(_.extend({}, this.authHeader, this.contentTypeHeader));

    return this.http
      .get(`${this.baseUrl}/users/${username}/tags`, { headers })
      .toPromise()
      .then((response: Response) => {
        return response.json().data;
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
}
