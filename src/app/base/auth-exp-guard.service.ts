import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';
import { loginBeforeAuthExp } from '../config';

/**
 * When logged in but authentication is expired or close to expiration,
 * redirect to login.
 * Otherwise activate.
 */
@Injectable()
export class AuthExpGuard implements CanActivate {

  constructor(private auth: AuthService,
              private model: ModelService,
              private router: Router) { }

  async canActivate(_route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Promise<boolean> {

    // if i'm logged in and there is too short time till authentication expiration
    // log out and redirect to login page
    if (this.auth.logged) {
      const expiresIn = await this.model.authExpiration();

      if (expiresIn < loginBeforeAuthExp) {
        // redirect to login with ?redirect=current url
        const url: string = state.url;
        this.auth.logout();
        this.router.navigate(['/login'], {
          queryParams: { redirect: url }
        });
        return false;
      }
    }

    return true;
  }
}
