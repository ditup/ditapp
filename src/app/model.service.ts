import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LatLng } from 'leaflet';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as _ from 'lodash';

import { Tag, User, UserTag, Message, Contact } from './shared/types';
import { AuthService } from './auth.service';

declare const Buffer; // fixing a weird error (not declared Buffer)

@Injectable()
export class ModelService {

  private baseUrl = 'https://dev.ditup.org/api';

  private generateAuthHeader = this.generateBasicAuthHeader;

  private contentTypeHeader = {
    'Content-Type': 'application/vnd.api+json',
  };

  constructor(private http: Http, private httpc: HttpClient, private auth: AuthService) { }

  async createUser({ username, email, password }: User): Promise<User> {
    const requestBody = {
      data: {
        type: 'users',
        attributes: {
          username,
          email,
          password
        }
      }
    };

    const headers = this.notLoggedHttpHeaders;

    const response: any = await this.httpc
      .post(`${this.baseUrl}/users`, requestBody, { headers })
      .toPromise();

    return this.deserializeUser(response.data);
  }

  private get notLoggedHeaders() {
    return new Headers(this.contentTypeHeader);
  }

  private get loggedHeaders() {
    return new Headers(_.extend({}, this.authHeader, this.contentTypeHeader));
  }

  // the logged headers as expected by HttpClient
  private get loggedHttpHeaders() {

    const [auth] = Object.entries(this.authHeader);
    const [contentType] = Object.entries(this.contentTypeHeader);

    return new HttpHeaders().append(auth[0], auth[1]).append(contentType[0], contentType[1]);
  }

  private get notLoggedHttpHeaders() {

    const [contentType] = Object.entries(this.contentTypeHeader);

    return new HttpHeaders().append(contentType[0], contentType[1]);
  }

  /**
   * @TODO this function is hugely imperfect. we don't know how to work with Observables catch etc
   *
   *
   */
  isUsernameAvailable(username: string): Observable<boolean> {
    console.log('searching for availability of', username);

    const headers = this.notLoggedHttpHeaders;

    return this.httpc
      .head(`${this.baseUrl}/users/${username}`, { headers, observe: 'response' })
      .map((resp: HttpResponse<any>) => {
        if (resp.status === 200) { return false; }
      })
      .catch((err): Observable<boolean> => {
        if (err.status === 404) { return new Observable(observer => observer.next(true)); }
      });
  }

  async verifyEmail(username: string, code: string): Promise<string> {

    const body = {
      data: {
        type: 'users',
        id: username,
        attributes: {
          emailVerificationCode: code
        }
      }
    };

    const response = await this.httpc
      .patch(`${this.baseUrl}/account`, body, { headers: this.notLoggedHttpHeaders })
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

  async basicAuth({ username, password }: User): Promise<User> {
    // generate an Authorization header
    const authHeader = this.createBasicAuthHeader({ username, password });

    const headers = new HttpHeaders(Object.assign({}, authHeader, this.contentTypeHeader));

    const response: HttpResponse<any> = await this.httpc
      .get(`${this.baseUrl}/auth/basic`, { headers, observe: 'response' })
      .toPromise();

    return this.deserializeUser(response.body.data);
  }

  async readUser(username: string): Promise<User> { // @TODO better return type

    const response: any = await this.httpc
      .get(`${this.baseUrl}/users/${username}`, { headers: this.loggedHttpHeaders })
      .toPromise();

    return this.deserializeUser(response.data);
  }

  /**
   * @param {string} username
   * @param {Object} fields
   * @param {string} [fields.givenName]
   * @param {string} [fields.familyName]
   * @param {string} [fields.description]
   * @param {[number, number]} [fields.location]
   * @returns {Promise<User>}
   */
  async updateUser(username: string, fields: {
    givenName?: string, familyName?: string, description?: string, location?: [number, number]
  }): Promise<User> {

    const requestBody = {
      data: {
        type: 'users',
        id: username,
        attributes: fields
      }
    };

    const response: any = await this.httpc
      .patch(`${this.baseUrl}/users/${username}`, requestBody, { headers: this.loggedHttpHeaders })
      .toPromise();

    return this.deserializeUser(response.data);
  }

  /**
   * Get user-tags of a given user from API
   * @param {string} username: what user's tags we search
   * @returns {Promise<UserTag[]>} array of formatted userTags
   */
  async readUserTags(username: string): Promise<UserTag[]> {
    const response: any = await this.httpc
      .get(`${this.baseUrl}/users/${username}/tags`, { headers: this.loggedHttpHeaders }).toPromise();

    const { data, included }: { data: any[], included: any[] } = response;

    return data.map((rawUserTag) => {
      return this.deserializeUserTag(rawUserTag, included);
    });
  }

  async createTag({ tagname }: Tag): Promise<Tag> {

    const requestBody = {
      data: {
        type: 'tags',
        attributes: {
          tagname
        }
      }
    };

    const headers = this.loggedHttpHeaders;

    const response: any = await this.httpc
      .post(`${this.baseUrl}/tags`, requestBody, { headers })
      .toPromise();

    return this.deserializeTag(response.data);
  }

  /**
   * @TODO this function is hugely imperfect. we don't know how to work with Observables catch etc
   *
   *
   */
  isTagnameAvailable(tagname: string): Observable<boolean> {
    const headers = this.loggedHttpHeaders;

    return this.httpc
      .head(`${this.baseUrl}/tags/${tagname}`, { headers, observe: 'response' })
      .map((resp: HttpResponse<any>) => {
        if (resp.status === 200) { return false; }
      })
      .catch((err): Observable<boolean> => {
        if (err.status === 404) {
          return new Observable(observer => observer.next(true));
        }

        throw err;
      });
  }

  async addTagToUser({ username, tagname, relevance, story }:
               { username: string, tagname: string, relevance?: number, story?: string }): Promise<UserTag> {

    // defaults
    relevance = relevance || 3;
    story = story || '';

    const requestBody = {
      data: {
        type: 'user-tags',
        attributes: {
          relevance,
          story
        },
        relationships: {
          tag: {
            data: {
              type: 'tags',
              id: tagname
            }
          }
        }
      }
    };

    const { data, included }: any = await this.httpc
      .post(`${this.baseUrl}/users/${username}/tags`, requestBody, { headers: this.loggedHttpHeaders })
      .toPromise();

    return this.deserializeUserTag(data, included);

  }

  readTagsLike(value: string): Observable<Tag[]> {

    const headers = this.loggedHttpHeaders;

    return this.httpc
      .get(`${this.baseUrl}/tags?filter[tagname][like]=${encodeURIComponent(value)}`, { headers })
      .map((response: any) => response.data.map((tagDatum: any) => this.deserializeTag(tagDatum)));
  }

  async updateUserTag(username: string, tagname: string, data: { story?: string, relevance?: number}): Promise<UserTag> {
    const requestBody = {
      data: {
        type: 'users',
        id: `${username}--${tagname}`,
        attributes: data
      }
    };

    const headers = this.loggedHttpHeaders;

    const response: any = await this.httpc
      .patch(`${this.baseUrl}/users/${username}/tags/${tagname}`, requestBody, { headers })
      .toPromise();

    const { data: rawTag, included } = response;
    return this.deserializeUserTag(rawTag, included);

  }

  async removeUserTag(username: string, tagname: string): Promise<void> {

    const headers = this.loggedHttpHeaders;

    await this.httpc
      .delete(`${this.baseUrl}/users/${username}/tags/${tagname}`, { headers })
      .toPromise();
  }

  async readAvatar(username: string): Promise<any> {
    const headers = this.loggedHttpHeaders;

    const response: any = await this.httpc
      .get(`${this.baseUrl}/users/${username}/avatar`, { headers })
      .toPromise();

    const { data } = response;
    return data.attributes;
  }

  async readTag(tagname: string): Promise<Tag> {
    const headers = this.loggedHttpHeaders;

    const response: any = await this.httpc
      .get(`${this.baseUrl}/tags/${tagname}`, { headers })
      .toPromise();

    const { data } = response;
    return this.deserializeTag(data);
  }

  async tagExists(tagname: string): Promise<boolean> {

    try {
      const available = await this.isTagnameAvailable(tagname).toPromise();
      return !available;
    } catch (e) {
      if (e.status === 400) {
        return false;
      }

      throw e;
    }
  }

  /**
   * Read New Users
   */
  public async findNewUsers(): Promise<User[]> {
    const headers = this.loggedHttpHeaders;

    const response: any = await this.httpc
      .get(`${this.baseUrl}/users?sort=-created&page[offset]=0&page[limit]=5`, { headers })
      .toPromise();

    const { data } = response;

    return data.map((userData: any) => this.deserializeUser(userData)) as User[];
  }

  async findUsersByTags(tags: Tag[]): Promise<User[]> {
    const headers = this.loggedHttpHeaders;

    const tagnames: string = tags.map(tag => tag.tagname).join(',');

    console.log(`${this.baseUrl}/users?filter[tag]=${tagnames}`);

    const response: any = await this.httpc
      .get(`${this.baseUrl}/users?filter[tag]=${tagnames}`, { headers })
      .toPromise();

    const { data, included } = response;

    const users: User[] = data.map((userData: any) => this.deserializeUserWithTags(userData, included));

    return users;
  }

  public async findUsersByMyTags() {
    const headers = this.loggedHttpHeaders;

    const response: any = await this.httpc
      .get(`${this.baseUrl}/users?filter[byMyTags]`, { headers })
      .toPromise();

    const { data, included } = response;

    const users: User[] = data.map(userData => this.deserializeUserWithTags(userData, included));
    return users;
  }

  public findUsersWithinRectangle(sw: LatLng, ne: LatLng): Observable<User[]> {
    const headers = this.loggedHttpHeaders;

    const locationString = `${sw.lat},${sw.lng},${ne.lat},${ne.lng}`;

    return this.httpc
      .get(`${this.baseUrl}/users?filter[location]=${locationString}`, { headers })
      .map((response: any) => {
        const { data } = response;

        return data.map((user: any) => this.deserializeUser(user));
      });
  }

  /**
   * find tags related to tags of logged user
   * @returns Promise<Tag[]>
   */
  public async findTagsByMyTags(): Promise<Tag[]> {
    const headers = this.loggedHttpHeaders;

    const response: any = await this.httpc
      .get(`${this.baseUrl}/tags?filter[relatedToMyTags]`, { headers })
      .toPromise();

    const { data } = response;

    const tags: Tag[] = data.map(tag => this.deserializeTag(tag));
    return tags;
  }

  /**
   * find tags related to provided tags
   * @param {Tag[]} tagsIn - array of provided tags
   * @returns Tag[] - found tags
   */
  public async findTagsByTags(tagsIn: Tag[]): Promise<Tag[]> {
    const headers = this.loggedHttpHeaders;

    const tagQueryString = tagsIn.map((tag: Tag) => tag.tagname).join(',');

    const response: any = await this.httpc
      .get(`${this.baseUrl}/tags?filter[relatedToTags]=${tagQueryString}`, { headers })
      .toPromise();

    const { data } = response;
    console.log(typeof(response), response.status);

    const tagsOut: Tag[] = data.map((tag) => this.deserializeTag(tag));
    return tagsOut;
  }

  public async findRandomTags(): Promise<Tag[]> {
    const headers = this.loggedHttpHeaders;

    const response: any = await this.httpc
      .get(`${this.baseUrl}/tags?filter[random]`, { headers })
      .toPromise();

    const { data } = response;

    const tags: Tag[] = data.map(tag => this.deserializeTag(tag));
    return tags;
  }

  public async readMessagesWith(username: string): Promise<Message[]> {
    const headers = this.loggedHttpHeaders;

    const response: any = await this.httpc
      .get(`${this.baseUrl}/messages?filter[with]=${username}`, { headers })
      .toPromise();

    const { data, included } = response;

    const messages: Message[] = data.map((msgData: any) => {
      return this.deserializeMessage(msgData, included);
    });

    return messages;
  }

  public async readThreads(): Promise<Message[]> {
    const headers = this.loggedHttpHeaders;

    const response: any = await this.httpc
      .get(`${this.baseUrl}/messages?filter[threads]`, { headers })
      .toPromise();

    const { data, included } = response;

    const messages: Message[] = data.map((msgData: any) => {
      return this.deserializeMessage(msgData, included);
    });

    return messages;
  }

  public async sendMessage(to: string, { body }: { body: string }): Promise<Message> {

    const headers = this.loggedHttpHeaders;

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

    const response: any = await this.httpc
      .post(`${this.baseUrl}/messages`, requestBody, { headers })
      .toPromise();

      const { data, included } = response;

      return this.deserializeMessage(data, included);
  }

  public async updateMessageToRead(message: Message) {

    const headers = this.loggedHttpHeaders;

    const requestBody = {
      data: {
        type: 'messages',
        id: message.id,
        attributes: {
          read: true
        }
      }
    };

    const response: any = await this.httpc
      .patch(`${this.baseUrl}/messages/${message.id}`, requestBody, { headers })
      .toPromise();

      const { data, included } = response;

      return this.deserializeMessage(data, included);
  }

  public countUnreadMessages(): Observable<number> {
    return this.httpc
      .get(`${this.baseUrl}/messages?filter[count]`, { headers: this.loggedHttpHeaders })
      .map((resp: any) => {
        return resp.meta.unread;
      });
  }

  public async requestResetPassword(usernameOrEmail: string): Promise<void> {
    const requestBody = {
      data: {
        type: 'users',
        id: usernameOrEmail
      }
    };

    await this.http
      .patch(`${this.baseUrl}/account?reset-password`, JSON.stringify(requestBody), { headers: new Headers(this.contentTypeHeader) })
      .toPromise();

    return;

  }

  public async resetPassword(username: string, password: string, code: string): Promise<void> {
    const requestBody = {
      data: {
        type: 'users',
        id: username,
        attributes: {
          password,
          code
        }
      }
    };

    await this.http
      .patch(`${this.baseUrl}/account`, JSON.stringify(requestBody), { headers: new Headers(this.contentTypeHeader) }).toPromise();

    return;
  }

  public async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const requestBody = {
      data: {
        type: 'users',
        id: this.auth.username,
        attributes: {
          oldPassword,
          password: newPassword
        }
      }
    };

    console.log(requestBody);

    await this.httpc
      .patch(`${this.baseUrl}/account`, JSON.stringify(requestBody), { headers: this.loggedHttpHeaders }).toPromise();

    return;
  }

  public async changeEmail(username: string, email: string, password: string): Promise<void> {
    const requestBody = {
      data: {
        type: 'users',
        id: username,
        attributes: {
          email,
          password
        }
      }
    };

    await this.http
      .patch(`${this.baseUrl}/account`, JSON.stringify(requestBody), { headers: this.loggedHeaders }).toPromise();

    return;
  }

  public async sendContactRequestTo(username: string,
                                    { message, trust, reference }: { message: string, trust: number, reference: string }): Promise<void> {

    const requestBody = {
      data: {
        type: 'contacts',
        attributes: {
          message,
          trust,
          reference
        },
        relationships: {
          to: { data: { type: 'users', id: username }}
        }
      }
    };

    await this.http
      .post(`${this.baseUrl}/contacts`, JSON.stringify(requestBody), { headers: this.loggedHeaders }).toPromise();
    return;
  }

  public async updateContactWith(username: string,
                                 attributes: { trust?: number, reference?: string, isConfirmed?: boolean, message?: string }
                                ): Promise<void> {
    const me = this.auth.username;
    const other = username;

    const requestBody = {
      data: {
        type: 'contacts',
        id: `${me}--${other}`,
        attributes
      }
    };

    await this.http
      .patch(`${this.baseUrl}/contacts/${me}/${other}`, JSON.stringify(requestBody), { headers: this.loggedHeaders }).toPromise();
    return;
  }

  public async deleteContactWith(username: string): Promise<void> {
    const me = this.auth.username;
    const other = username;

    await this.http
      .delete(`${this.baseUrl}/contacts/${me}/${other}`, { headers: this.loggedHeaders }).toPromise();
    return;
  }

  public confirmContactRequestFrom(username: string, { trust, reference }: { trust: number, reference: string }): Promise<void> {
    const attributes = { isConfirmed: true, trust, reference };
    return this.updateContactWith(username, attributes);
  }

  public async readContactsTo(username: string): Promise<Contact[]> {
    const response = await this.http
      .get(`${this.baseUrl}/contacts?filter[to]=${username}`, { headers: this.loggedHeaders }).toPromise();

    const { data, included } = response.json();

    return _.map(data, (raw: any) => this.deserializeContact(raw, included));
  }

  public async readContact(from: string, to: string): Promise<Contact> {

    const response = await this.http
      .get(`${this.baseUrl}/contacts/${from}/${to}`, { headers: this.loggedHeaders }).toPromise();

    const { data, included } = response.json();

    return this.deserializeContact(data, included);
  }

  private deserializeMessage(msgData: any, included: any): Message {

    const fromUsername: string = msgData.relationships.from.data.id;
    const toUsername: string = msgData.relationships.to.data.id;

    const fromData = _.find(included, (user: any) => {
      return user.type === 'users' && user.id === fromUsername;
    });

    const toData = _.find(included, (user: any) => {
      return user.type === 'users' && user.id === toUsername;
    });

    const from = this.deserializeUser(fromData);
    const to = this.deserializeUser(toData);
    const id = msgData.id;
    const body = msgData.attributes.body;
    const created = msgData.attributes.created;
    const read = msgData.attributes.read;

    return new Message({ from, to, id, body, created, read });
  }

  private deserializeContact(data: any, included: any): Contact {
    const fromUsername: string = data.relationships.from.data.id;
    const toUsername: string = data.relationships.to.data.id;
    const creatorUsername: string = data.relationships.creator.data.id;

    const fromData = _.find(included, (user: any) => {
      return user.type === 'users' && user.id === fromUsername;
    });

    const toData = _.find(included, (user: any) => {
      return user.type === 'users' && user.id === toUsername;
    });

    const creatorData = _.find(included, (user: any) => {
      return user.type === 'users' && user.id === creatorUsername;
    });

    const from = this.deserializeUser(fromData);
    const to = this.deserializeUser(toData);
    const creator = this.deserializeUser(creatorData);

    const { isConfirmed, confirmed, created, trust, reference, message } = data.attributes;

    return new Contact({ from, to, isConfirmed, confirmed, created, trust, reference, message, creator });
  }

  private deserializeUser(userData: any): User {
    const attrs = ['givenName', 'familyName', 'description', 'location', 'preciseLocation', 'email'];
    const user: User = _.extend({ username: userData.id }, _.pick(userData.attributes, attrs));

    return user;
  }

  private deserializeUserWithTags(userData: any, included: any[]): User {
    const user = this.deserializeUser(userData);
    const tagRels = userData.relationships.tags.data;
    const userTags = tagRels.map(
      tagRel => this.deserializeUserTag(
        included.find(c => c.type === 'user-tags' && c.id === tagRel.id),
        included
      )
    );

    user.userTags = userTags;
    return user;
  }

  private deserializeTag(tagData: any): Tag {
    return { tagname: tagData.id };
  }

  private deserializeUserTag(rawUserTag: any, included: any[]): UserTag {
    const [username, tagname] = rawUserTag.id.split('--');

    const rawTag = included.find((inclusion) => {
      return inclusion.type === 'tags' && inclusion.id === tagname;
    });
    const tag: Tag = this.deserializeTag(rawTag)

    const rawUser = included.find((inclusion) => {
      return inclusion.type === 'users' && inclusion.id === username;
    });
    const user: User = this.deserializeUser(rawUser);

    const { story, relevance } = rawUserTag.attributes;

    return { user, tag, story, relevance } as UserTag;
  }
}
