import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  NavigationExtras
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthMeGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    let username: string = route.params['username'];
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
