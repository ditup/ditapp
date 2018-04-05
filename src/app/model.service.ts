import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { LatLng } from 'leaflet';
import { api } from './config';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import { map, catchError } from 'rxjs/operators';

import * as _ from 'lodash';

import { Comment, Contact } from './shared/types';
import * as fromRoot from 'app/reducers';
import { Store, select } from '@ngrx/store';
import { User } from 'app/models/user';
import { Idea } from 'app/models/idea';
import { Message } from 'app/models/message';
import { Tag } from 'app/models/tag';
import { UserTag } from 'app/models/user-tag';

@Injectable()
export class ModelService {

  private baseUrl = api.baseUrl;

  private auth$: Observable<any>;

  private cache: any = {
    avatar: { }
  };

  private get auth() {
    let value;
    this.auth$.take(1).subscribe(auth => value = auth)
    return value;
  }

  // the logged headers as expected by HttpClient
  private get loggedHeaders() {
    return this.notLoggedHeaders
      .set('Authorization', `Bearer ${this.auth.token}`);
  }

  private get notLoggedHeaders() {
    return new HttpHeaders()
      .set('Content-Type', 'application/vnd.api+json')
      .set('Accept', 'application/vnd.api+json');
  }

  constructor(private http: HttpClient, private store: Store<fromRoot.State>) {
    this.auth$ = this.store.pipe(
      select('auth')
    )
  }

  async createUser({ username, email, password }: { username: string, email: string, password: string }): Promise<User> {
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

    const headers = this.notLoggedHeaders;

    const response: any = await this.http
      .post(`${this.baseUrl}/users`, requestBody, { headers })
      .toPromise();

    return this.deserializeUser(response.data);
  }

  /**
   * @TODO this function is hugely imperfect. we don't know how to work with Observables catch etc
   *
   *
   */
  isUsernameAvailable(username: string): Observable<boolean> {
    console.log('searching for availability of', username);

    const headers = this.notLoggedHeaders;

    return this.http
      .head(`${this.baseUrl}/users/${username}`, { headers, observe: 'response', responseType: 'text' })
      .map((resp: HttpResponse<any>) => {
        console.log('***', resp);
        if (resp.status === 200) {
          console.log(200);
          return false;
        }
      })
      .catch((err): Observable<boolean> => {
        console.log('error', err.status, err);
        if (err.status === 404) {
          console.log(404);
          return Observable.of(true);
        }
      });
  }

  async verifyEmail(username: string, code: string): Promise<{ email: string, token: string }> {

    const body = {
      data: {
        type: 'users',
        id: username,
        attributes: {
          emailVerificationCode: code
        }
      }
    };

    try {
      const response: any = await this.http
        .patch(`${this.baseUrl}/account`, body, { headers: this.notLoggedHeaders })
        .toPromise();

      const { email, token } = response.meta;
      return { email, token };
    } catch (e) {
      throw { status: e.status, message: 'todo error' };
    }
  }

  async getJwtToken(username: string, password: string): Promise<string> {
    const basicAuthHeader = `Basic ${new Buffer(`${username}:${password}`).toString('base64')}`;

    const headers: HttpHeaders = this.notLoggedHeaders.append('Authorization', basicAuthHeader);

    const { meta: { token } }: any = await this.http
      .get(`${this.baseUrl}/auth/token`, { headers })
      .toPromise();

    return token;
  }

  authExpiration(token?: string): Observable<number> {
    const headers = this.notLoggedHeaders
      .set('Authorization', `Bearer ${token || this.auth.token}`);

    return this.http
      .get(`${this.baseUrl}/auth/exp`, { headers })
      .pipe(
        map((response: any) => response.meta.exp as number),
        catchError((e) => {
          if (e.status === 403) return Observable.of(-1);
          throw e;
        })
      )


/*
      return response.meta.exp as number;
    } catch (e) {
      console.error(e);
      if (e.status === 403) {
        return -1;
      }

      throw e;
    }
    */
  }

  async readUser(username: string, options: { token: string } = { token: '' }): Promise<User> { // @TODO better return type

    const headers = this.notLoggedHeaders
      .set('Authorization', `Bearer ${options.token || this.auth.token}`);

    const response: any = await this.http
      .get(`${this.baseUrl}/users/${username}`, { headers })
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

    username = username || this.auth.user.username;

    const requestBody = {
      data: {
        type: 'users',
        id: username,
        attributes: fields
      }
    };

    const response: any = await this.http
      .patch(`${this.baseUrl}/users/${username}`, requestBody, { headers: this.loggedHeaders })
      .toPromise();

    return this.deserializeUser(response.data);
  }

  /**
   * Get user-tags of a given user from API
   * @param {string} username: what user's tags we search
   * @returns {Promise<UserTag[]>} array of formatted userTags
   */
  async readUserTags(username: string): Promise<UserTag[]> {
    const response: any = await this.http
      .get(`${this.baseUrl}/users/${username}/tags`, { headers: this.loggedHeaders }).toPromise();

    const { data, included }: { data: any[], included: any[] } = response;

    return data.map((rawUserTag) => {
      return this.deserializeUserTag(rawUserTag, included);
    });
  }

  async createTag({ id }: Tag): Promise<Tag> {

    const requestBody = {
      data: {
        type: 'tags',
        attributes: {
          tagname: id
        }
      }
    };

    const headers = this.loggedHeaders;

    const response: any = await this.http
      .post(`${this.baseUrl}/tags`, requestBody, { headers })
      .toPromise();

    return this.deserializeTag(response.data);
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

    const { data, included }: any = await this.http
      .post(`${this.baseUrl}/users/${username}/tags`, requestBody, { headers: this.loggedHeaders })
      .toPromise();

    return this.deserializeUserTag(data, included);

  }

  readTagsLike(value: string): Observable<Tag[]> {

    // don't send empty request
    if (value === '') {
      return Observable.of([]);
    }

    const headers = this.loggedHeaders;

    return this.http
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

    const headers = this.loggedHeaders;

    const response: any = await this.http
      .patch(`${this.baseUrl}/users/${username}/tags/${tagname}`, requestBody, { headers })
      .toPromise();

    const { data: rawTag, included } = response;
    return this.deserializeUserTag(rawTag, included);

  }

  async removeUserTag(username: string, tagname: string): Promise<void> {

    const headers = this.loggedHeaders;

    await this.http
      .delete(`${this.baseUrl}/users/${username}/tags/${tagname}`, { headers })
      .toPromise();
  }

  /**
   * provide a blob, the encoded blob as base64 data url will be returned
   */
  private blobToDataUrl(blob): Promise<string> {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = function() {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  }

  async readAvatar(username: string, size = 128, cache = true): Promise<string> {

    if (cache === true) {
      // if cache === true and chached, return cached promise
      if (_.has(this.cache, `${username}.${size}`)) {
        return await this.cache[username][size];
      }

      // if cache === true and not cached, request and save
      const avatarRequestPromise = this.sendAvatarRequest(username, size);

      this.cache[username] = this.cache[username] || { };
      this.cache[username][size] = avatarRequestPromise;

      try {
        return await avatarRequestPromise;
      } catch (e) {
        delete this.cache[username][size];
      }
    }

    // if cache === false, delete the cache and send a request
    delete this.cache[username];

    return await this.sendAvatarRequest(username, size);
  }

  private async sendAvatarRequest(username: string, size: number): Promise<string> {
    const headers = this.loggedHeaders
      .set('Accept', 'image/jpeg, image/svg+xml');

    const response: any = await this.http
      .get(`${this.baseUrl}/users/${username}/avatar?filter[size]=${size}`, { headers, responseType: 'blob', observe: 'response' })
      .toPromise();

    // blob to base64 data url
    return await this.blobToDataUrl(response.body);
  }

  /*
   * TODO for future reference
   * currently the method doesn't work
   * and we use ng2-fancy-image-uploader instead
   * probably because 'Content-Type': 'multipart/form-data' doesn't contain boundaries information
   * related stackoverflow question: https://stackoverflow.com/questions/46059226/upload-image-with-httpclient
   */
  /*
  async updateAvatar(file: File): Promise<void> {
    // authentication header without content-type
    const headers = new HttpHeaders()
      .append('Content-Type', 'multipart/form-data')
      .append(this.authHeader[0], this.authHeader[1]);


    const username = this.auth.username;

    const formData: FormData = new FormData();
    formData.append('avatar', file, file.name);

    console.log(formData);

    const response: any = await this.http
      .patch(`${this.baseUrl}/users/${username}/avatar`, formData, { headers, observe: 'response' })
      .toPromise();

    console.log(response.status);

  }
  */

  async readTag(tagname: string): Promise<Tag> {
    const headers = this.loggedHeaders;

    const response: any = await this.http
      .get(`${this.baseUrl}/tags/${tagname}`, { headers })
      .toPromise();

    const { data } = response;
    return this.deserializeTag(data);
  }

  async tagExists(tagname: string): Promise<boolean> {

    const headers = this.loggedHeaders;

    try {
      const response: HttpResponse<any> = await this.http
        .head(`${this.baseUrl}/tags/${tagname}`, { headers, observe: 'response', responseType: 'text' }).toPromise();

      if (response.status === 200) {
        return true;
      } else {
        throw new Error(`unexpected response status: ${response.status}`);
      }
    } catch (e) {
      if (e.status === 404 || e.status === 400) { return false; }
      throw e;
    }
  }

  /**
   * Read New Users
   */
  public async findNewUsers(): Promise<User[]> {
    const headers = this.loggedHeaders;

    const response: any = await this.http
      .get(`${this.baseUrl}/users?sort=-created&page[offset]=0&page[limit]=5`, { headers })
      .toPromise();

    const { data } = response;

    return data.map((userData: any) => this.deserializeUser(userData)) as User[];
  }

  async findUsersByTags(tags: Tag[]): Promise<User[]> {
    if (tags.length === 0) {
      return [];
    }

    const headers = this.loggedHeaders;

    const tagnames: string = tags.map(tag => tag.id).join(',');

    const response: any = await this.http
      .get(`${this.baseUrl}/users?filter[tag]=${tagnames}`, { headers })
      .toPromise();

    const { data, included } = response;

    const users: User[] = data.map((userData: any) => this.deserializeUserWithTags(userData, included));

    return users;
  }

  public async findUsersByMyTags() {
    const headers = this.loggedHeaders;

    const response: any = await this.http
      .get(`${this.baseUrl}/users?filter[byMyTags]`, { headers })
      .toPromise();

    const { data, included } = response;

    const users: User[] = data.map(userData => this.deserializeUserWithTags(userData, included));
    return users;
  }

  public findUsersWithinRectangle(sw: LatLng, ne: LatLng): Observable<User[]> {
    const headers = this.loggedHeaders;

    const locationString = `${sw.lat},${sw.lng},${ne.lat},${ne.lng}`;

    return this.http
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
    const headers = this.loggedHeaders;

    const response: any = await this.http
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
    if (tagsIn.length === 0) {
      return [];
    }

    const headers = this.loggedHeaders;

    const tagQueryString = tagsIn.map((tag: Tag) => tag.id).join(',');

    const response: any = await this.http
      .get(`${this.baseUrl}/tags?filter[relatedToTags]=${tagQueryString}`, { headers })
      .toPromise();

    const { data } = response;

    const tagsOut: Tag[] = data.map((tag) => this.deserializeTag(tag));
    return tagsOut;
  }

  public async findRandomTags(limit = 3): Promise<Tag[]> {
    const headers = this.loggedHeaders;

    const response: any = await this.http
      .get(`${this.baseUrl}/tags?filter[random]&page[offset]=0&page[limit]=${limit}`, { headers })
      .toPromise();

    const { data } = response;

    const tags: Tag[] = data.map(tag => this.deserializeTag(tag));
    return tags;
  }

  public async readMessagesWith(username: string): Promise<Message[]> {
    const headers = this.loggedHeaders;

    const response: any = await this.http
      .get(`${this.baseUrl}/messages?filter[with]=${username}`, { headers })
      .toPromise();

    const { data, included } = response;

    const messages: Message[] = data.map((msgData: any) => {
      return this.deserializeMessage(msgData, included);
    });

    return messages;
  }

  public async readThreads(): Promise<Message[]> {
    const headers = this.loggedHeaders;

    const response: any = await this.http
      .get(`${this.baseUrl}/messages?filter[threads]`, { headers })
      .toPromise();

    const { data, included } = response;

    const messages: Message[] = data.map((msgData: any) => {
      return this.deserializeMessage(msgData, included);
    });

    return messages;
  }

  public async sendMessage(to: string, { body }: { body: string }): Promise<Message> {

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

    const response: any = await this.http
      .post(`${this.baseUrl}/messages`, requestBody, { headers })
      .toPromise();

      const { data, included } = response;

      return this.deserializeMessage(data, included);
  }

  public async updateMessageToRead(message: Message): Promise<Message[]> {

    const headers = this.loggedHeaders;

    const requestBody = {
      data: {
        type: 'messages',
        id: message.id,
        attributes: {
          read: true
        }
      }
    };

    // updates to read the provided and all older messages
    // which are received and unread
    const response: any = await this.http
      .patch(`${this.baseUrl}/messages/${message.id}`, requestBody, { headers })
      .toPromise();

    const { data, included } = response;

    const messages: Message[] = data.map((msgData: any) => {
      return this.deserializeMessage(msgData, included);
    });

    return messages;
  }

  public countUnreadMessages(): Observable<number> {
    return this.http
      .get(`${this.baseUrl}/messages?filter[count]`, { headers: this.loggedHeaders })
      .map((resp: any) => {
        return resp.meta.unread;
      });
  }

  public async requestResetPassword(usernameOrEmail: string): Promise<void> {
    const headers = this.notLoggedHeaders;
    const requestBody = {
      data: {
        type: 'users',
        id: usernameOrEmail
      }
    };

    await this.http
      .patch(`${this.baseUrl}/account?reset-password`, requestBody, { headers })
      .toPromise();
  }

  public async resetPassword(username: string, password: string, code: string): Promise<void> {

    const headers = this.notLoggedHeaders;

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
      .patch(`${this.baseUrl}/account`, requestBody, { headers }).toPromise();
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

    await this.http
      .patch(`${this.baseUrl}/account`, requestBody, { headers: this.loggedHeaders }).toPromise();

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
      .patch(`${this.baseUrl}/account`, requestBody, { headers: this.loggedHeaders }).toPromise();

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
      .post(`${this.baseUrl}/contacts`, requestBody, { headers: this.loggedHeaders }).toPromise();
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
      .patch(`${this.baseUrl}/contacts/${me}/${other}`, requestBody, { headers: this.loggedHeaders }).toPromise();
  }

  public async deleteContactWith(username: string): Promise<void> {
    const me = this.auth.username;
    const other = username;

    await this.http
      .delete(`${this.baseUrl}/contacts/${me}/${other}`, { headers: this.loggedHeaders }).toPromise();
  }

  public confirmContactRequestFrom(username: string, { trust, reference }: { trust: number, reference: string }): Promise<void> {
    const attributes = { isConfirmed: true, trust, reference };
    return this.updateContactWith(username, attributes);
  }

  async readContactsTo(username: string): Promise<Contact[]> {
    const response: any = await this.http
      .get(`${this.baseUrl}/contacts?filter[to]=${username}`, { headers: this.loggedHeaders }).toPromise();

    const { data, included } = response;

    return data.map((raw: any) => this.deserializeContact(raw, included));
  }

  async readContact(from: string, to: string): Promise<Contact> {

    const response: any = await this.http
      .get(`${this.baseUrl}/contacts/${from}/${to}`, { headers: this.loggedHeaders }).toPromise();

    const { data, included } = response;

    return this.deserializeContact(data, included);
  }

  /**
   * Create idea
   */
  public async createIdea({ title, detail }: Idea): Promise<Idea> {
    const requestBody = {
      data: {
        type: 'ideas',
        attributes: {
          title,
          detail
        }
      }
    };

    const response: any = await this.http
      .post(`${this.baseUrl}/ideas`, requestBody, { headers: this.loggedHeaders }).toPromise();

    return this.deserializeIdea(response.data);
  }

  /**
   * Read idea by id
   */
  public async readIdea(id: string): Promise<Idea> {
    const response: any = await this.http
      .get(`${this.baseUrl}/ideas/${id}`, { headers: this.loggedHeaders }).toPromise();

    return this.deserializeIdea(response.data, response.included);
  }

  /**
   * Update idea
   */
  public async updateIdea({ id, title, detail }: Idea): Promise<Idea> {
    const requestBody = {
      data: {
        type: 'ideas',
        id,
        attributes: {
          title,
          detail
        }
      }
    };

    const response: any = await this.http
      .patch(`${this.baseUrl}/ideas/${id}`, requestBody, { headers: this.loggedHeaders }).toPromise();

    return this.deserializeIdea(response.data);
  }

  /**
   * Read tags of idea
   */
  public async readIdeaTags(id: string): Promise<Tag[]> {
    const response: any = await this.http
      .get(`${this.baseUrl}/ideas/${id}/tags`, { headers: this.loggedHeaders }).toPromise();

    return response.data.map(ideaTag => this.deserializeIdeaTag(ideaTag));
  }

  /**
   * Add tag to idea
   */
  public async addIdeaTag(ideaId: string, tagname: string) {
    const requestBody = {
      data: {
        type: 'idea-tags',
        relationships: {
          tag: { data: { type: 'tags', id: tagname } }
        }
      }
    };

    const response: any = await this.http
      .post(`${this.baseUrl}/ideas/${ideaId}/tags`, requestBody, { headers: this.loggedHeaders }).toPromise();

    return this.deserializeIdeaTag(response.data);
  }

  /**
   * Remove tag from idea
   */
  public async removeIdeaTag(ideaId: string, tagname: string) {
    await this.http
      .delete(`${this.baseUrl}/ideas/${ideaId}/tags/${tagname}`, { headers: this.loggedHeaders }).toPromise();
  }

  /**
   * Read list of ideas sorted by relevance to the logged user
   * Relevance: idea has tags in common with the user
   */
  public async findIdeasWithMyTags(): Promise<Idea[]> {
    const response: any = await this.http
      .get(`${this.baseUrl}/ideas?filter[withMyTags]`, { headers: this.loggedHeaders }).toPromise();

    const { data, included } = response;

    return data.map(idea => this.deserializeIdea(idea, included));
  }

  /**
   * Read list of ideas with given tags
   */
  public async findIdeasWithTags(tags: Tag[]): Promise<Idea[]> {

    const tagnames = tags.map(tag => tag.id).join(',');

    const response: any = await this.http
      .get(`${this.baseUrl}/ideas?filter[withTags]=${tagnames}`, { headers: this.loggedHeaders }).toPromise();

    const { data, included } = response;

    return data.map(idea => this.deserializeIdea(idea, included));
  }

  /**
   * Read list of ideas sorted from newest to oldest
   */
  public async findNewIdeas(): Promise<Idea[]> {
    const response: any = await this.http
      .get(`${this.baseUrl}/ideas?sort=-created`, { headers: this.loggedHeaders }).toPromise();

    const { data, included } = response;

    return data.map(idea => this.deserializeIdea(idea, included));
  }

  /**
   * Read comments of a primary dit (i.e. idea)
   */
  public async readCommentsOf({ type, id }: { type: string, id: string }): Promise<Comment[]> {
    const response: any = await this.http
      .get(`${this.baseUrl}/${type}/${id}/comments`, { headers: this.loggedHeaders }).toPromise();

    return response.data.map(comment => this.deserializeComment(comment, response.included));
  }

  /**
   * Create comment for primary dit (i.e. idea)
   */
  public async addCommentTo({ type, id }: { type: string, id: string }, { content }: Comment, comments = 'comments'): Promise<Comment> {

    const requestBody = {
      data: {
        type: comments,
        attributes: { content }
      }
    };

    const response: any = await this.http
      .post(`${this.baseUrl}/${type}/${id}/${comments}`, requestBody, { headers: this.loggedHeaders }).toPromise();

    return this.deserializeComment(response.data);
  }

  /**
   * Delete comment by id
   */
  public async deleteComment(id: string, comments = 'comments'): Promise<void> {
    await this.http
      .delete(`${this.baseUrl}/${comments}/${id}`, { headers: this.loggedHeaders }).toPromise();
  }

  /**
   * Update comment
   */
  public async updateComment({ id, content }: Comment, comments = 'comments'): Promise<Comment> {

    const requestBody = {
      data: {
        type: comments,
        id,
        attributes: { content }
      }
    };

    const response: any = await this.http
      .patch(`${this.baseUrl}/${comments}/${id}`, requestBody, { headers: this.loggedHeaders }).toPromise();

    return this.deserializeComment(response.data);
  }

  private deserializeIdeaTag(ideaTagData: any): Tag {
    return this.deserializeTag(ideaTagData.relationships.tag.data);
  }

  private deserializeCommentSimple(commentData: any): Comment {
    return {
      id: commentData.id,
      content: commentData.attributes.content,
      created: commentData.attributes.created,
      creator: { id: commentData.relationships.creator.data.id }
    };
  }

  private deserializeComment(commentData: any, included?: any[]): Comment {

    const comment = this.deserializeCommentSimple(commentData);

    // format the reactions
    if (included && _.has(commentData, 'relationships.reactions')) {
      const reactions = commentData.relationships.reactions.data
        .map(({ id }: { id: string }) => {
          const includedReaction = included.find(incl => incl.type === 'reactions' && incl.id === id);

          return this.deserializeCommentSimple(includedReaction);
        });

      comment.reactions = reactions;
    }

    return comment;
  }

  private deserializeIdea(ideaData: any, included?: any[]): Idea {

    const { id, attributes: { title, detail }, relationships } = ideaData;

    const idea: Idea = { id, title, detail, creatorId: '', tags: null };

    // add creator
    if (relationships && relationships.creator && included) {
      const creatorUsername = relationships.creator.data.id;
      const rawCreator = included.find(({ type, id: includedId }) => type === 'users' && includedId === creatorUsername);
      const creator: User = this.deserializeUser(rawCreator);
      idea.creatorId = creator.id;
    }

    // add idea's tags
    if (relationships && relationships.ideaTags && included) {
      // get array of ideaTags
      const ideaTags = relationships.ideaTags.data.map(ideaTag => {
        const ideaTagId = ideaTag.id;
        // find each ideaTag in included
        return included.find(({ type, id: ideaTagIdIncluded }) => type === 'idea-tags' && ideaTagIdIncluded === ideaTagId);
      });

      idea.tags = ideaTags.map(ideaTag => this.deserializeIdeaTag(ideaTag));
    }

    return idea;
  }

  private deserializeMessage(msgData: any, included: any = []): Message {

    const fromUsername: string = msgData.relationships.from.data.id;
    const toUsername: string = msgData.relationships.to.data.id;

    const fromData = included.find((user: any) => {
      return user.type === 'users' && user.id === fromUsername;
    }) || msgData.relationships.from.data;

    const toData = included.find((user: any) => {
      return user.type === 'users' && user.id === toUsername;
    }) || msgData.relationships.to.data;

    const from = this.deserializeUser(fromData).id;
    const to = this.deserializeUser(toData).id;
    const id = msgData.id;
    const body = msgData.attributes.body;
    const created = msgData.attributes.created;
    const read = msgData.attributes.read;

    return { from, to, id, body, created, read } as Message;
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
    const user: User = _.extend({ id: userData.id }, _.pick(userData.attributes, attrs));

    return user;
  }

  private deserializeUserWithTags(userData: any, included: any[]): User {
    const user = this.deserializeUser(userData);
    const tagRels = userData.relationships.tags.data;
    const userTags = tagRels.map(
      tagRel => this.deserializeUserTag(
        included.find(c => c.type === 'user-tags' && c.id === tagRel.id),
        included.concat(userData) // users are missing in included. Providing them.
      )
    );

    user.userTags = userTags;
    return user;
  }

  private deserializeTag(tagData: any): Tag {
    return { id: tagData.id };
  }

  private deserializeUserTag(rawUserTag: any, included: any[]): UserTag {
    const [username, tagname] = rawUserTag.id.split('--');

    const rawTag = included.find((inclusion) => {
      return inclusion.type === 'tags' && inclusion.id === tagname;
    });
    const tag: Tag = this.deserializeTag(rawTag);

    const rawUser = included.find((inclusion) => {
      return inclusion.type === 'users' && inclusion.id === username;
    });
    const user: User = this.deserializeUser(rawUser);

    const { story, relevance } = rawUserTag.attributes;

    return { userId: user.id, tagId: tag.id, story, relevance } as UserTag;
  }
}
