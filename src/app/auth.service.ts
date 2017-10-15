import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import * as jwt from 'jsonwebtoken';

// import { ModelService } from './model.service';
// import { User } from './shared/types';

@Injectable()
export class AuthService {

  private loggedSource = new Subject<{
    logged: boolean,
    loggedUnverified: boolean,
    username: string}>();

  loggedStatusChanged$ = this.loggedSource.asObservable();

  // a wrapper of localStorage
  storage = {
    set(name: string, value: any) {
      localStorage.setItem(name, JSON.stringify(value));
    },
    get(name: string): any {
      return JSON.parse(localStorage.getItem(name));
    },
    clear() {
      localStorage.clear();
    }
  };

  constructor(/*private model: ModelService*/) { }

  logout() {
    this.storage.clear();

    this.loggedSource.next({
      logged: this.logged,
      loggedUnverified: this.loggedUnverified,
      username: this.username
    });
  }

  login(token: string) {

    // get the payload of the token
    const {
      username,
      verified: isEmailVerified
    }: {
      username: string,
      verified: boolean,
    } = jwt.decode(token) as any;

    // store login values in local storage
    this.storage.set('token', token);
    this.storage.set('username', username);
    this.storage.set('isEmailVerified', isEmailVerified);

    this.loggedSource.next({
      logged: this.logged,
      loggedUnverified: this.loggedUnverified,
      username: this.username
    });
  }

  get header() {
    return `Bearer ${this.token}`;
  }

  get logged(): boolean {
    return Boolean(this.username && this.isEmailVerified);
  }

  get loggedUnverified(): boolean {
    return Boolean(this.username && !this.isEmailVerified);
  }

  get username(): string {
    return this.storage.get('username');
  }

  private get isEmailVerified(): boolean {
    return this.storage.get('isEmailVerified');
  }

  get token(): string {
    return this.storage.get('token');
  }
}
