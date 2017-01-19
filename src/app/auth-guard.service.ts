import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  NavigationExtras
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {
    let url: string = state.url;

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
