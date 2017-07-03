import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    // satisfy compiler's no unused params
    route; // tslint:disable-line:no-unused-expression

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    // if logged in, continue
    if (this.auth.logged) {
      return true;
    }

    if (this.auth.loggedUnverified) {
      // if unverified, go to verify-email page
      this.router.navigate([`/user/${this.auth.username}/verify-email`], {
        queryParams: { redirect: url }
      });
    } else {
      // otherwise go to login page
      this.router.navigate(['/login'], {
        queryParams: { redirect: url }
      });
    }

    return false;
  }
}
