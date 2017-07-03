import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthMeGuard implements CanActivate {

  constructor(private auth: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const username: string = route.params['username'];
    console.log(route.url, route.params);

    return this.checkIsMe(username);
  }

  checkIsMe(username: string): boolean {
    console.log('checking if i am the user', username);
    if (this.auth.logged === true && this.auth.username === username) {
      return true;
    }

    return false;
  }
}
