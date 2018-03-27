import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api } from 'app/config';
import { notLoggedHeaders } from 'app/shared/utils';
import { Authenticate } from 'app/models/auth';
import { User } from 'app/models/user';

import { map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  getAuthToken({ username, password }: Authenticate): Observable<string> { // TODO better type
    const basic = `Basic ${new Buffer(`${username}:${password}`).toString('base64')}`;
    const basicAuthHeaders = notLoggedHeaders.set('Authorization', basic);

    return this.http.get(`${api.baseUrl}/auth/token`, { headers: basicAuthHeaders })
      .pipe(
        map((response: any) => response.meta.token)
      )
  }

  /**
   * Log in
   */
  login({ username, password }: Authenticate): Observable<{ verified: boolean, user: User, token: string }> {
    return this.getAuthToken({ username, password })
      .pipe(
        map((token: string) => {
          this.setPersistentLogin({ token })
          return {
            ...this.decodeToken(token),
            token
          }
        })
      )
  }

  loginFromStore(): { verified: boolean, user: User | null, token: string } {
    const data = this.getPersistentLogin();

    if (!data || data.token === '') return { verified: false, user: null, token: '' };

    return {
      ...this.decodeToken(data.token),
      token: data.token
    };
  }

  /**
   * Decode jwt token.
   */
  decodeToken(token: string): { verified: boolean, user: User } {
    const { username, verified } = jwt.decode(token) as any;
    return {
      verified,
      user: {
        username
      } as User
    };
  }

  /**
   * Save jwt token to local storage
   */
  setPersistentLogin({ token }) {
    localStorage.setItem('auth', JSON.stringify({ token }));
  }

  /**
   * Retrieve jwt token from local storage
   */
  getPersistentLogin(): { token: string } | null {
    return JSON.parse(localStorage.getItem('auth'))
  }

  /**
   * Remove jwt toke from local storage
   */
  clearPersistentLogin() {
    localStorage.setItem('auth', JSON.stringify(null));
  }

  logout() {
    console.log('logout service');
    return of(true);
  }


}
