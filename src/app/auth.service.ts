import { Injectable } from '@angular/core';

import { BasicAuthService } from './basic-auth.service';

@Injectable()
export class AuthService {

  logout = this.basicAuth.logout;

  constructor(private basicAuth: BasicAuthService) { }

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

}
