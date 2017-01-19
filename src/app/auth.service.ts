import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { BasicAuthService } from './basic-auth.service';

@Injectable()
export class AuthService {

  private loggedSource = new Subject<{
    logged: boolean,
    loggedUnverified: boolean,
    username: string}>();

  loggedStatusChanged$ = this.loggedSource.asObservable();

  constructor(private basicAuth: BasicAuthService) { }

  logout() {
    this.basicAuth.logout();
    this.loggedSource.next({
      logged: this.logged,
      loggedUnverified: this.loggedUnverified,
      username: this.username
    });
  }

  login({ method, credentials }: { method: string, credentials: any }) {

    switch (method) {
      case 'basic':
        this.basicAuth.login(credentials);
        this.loggedSource.next({
          logged: this.logged,
          loggedUnverified: this.loggedUnverified,
          username: this.username
        });
        break;
      default:
    }
  }

  get logged(): boolean {
    return this.basicAuth.logged;
  }

  get loggedUnverified(): boolean {
    return this.basicAuth.loggedUnverified;
  }

  get username(): string {
    return this.basicAuth.username;
  }

  get email(): string|undefined {
    return this.basicAuth.email;
  }

  get credentials(): { username: string, password: string } {
    return this.basicAuth.credentials;
  }

}
