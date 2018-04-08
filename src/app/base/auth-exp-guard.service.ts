/*
import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  RouterStateSnapshot,
  PRIMARY_OUTLET
} from '@angular/router';
import * as _ from 'lodash';

import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';
import { loginBeforeAuthExp } from '../config';

/**
 * When logged in but authentication is expired or close to expiration,
 * redirect to login.
 * Otherwise activate.
 * /
@Injectable()
export class AuthExpGuard implements CanActivate {

  constructor(private auth: AuthService,
              private model: ModelService,
              private router: Router) { }

  async canActivate(_route, state: RouterStateSnapshot): Promise<boolean> {

    // exceptions from the process - they will always be allowed
    // i.e. we don't want to redirect to login or signup after login
    const path = this.getUrlPath(state.url).join('--');
    const exceptions = ['login', 'signup'];
    const isException = exceptions.includes(path);

    // if i'm logged in and there is too short time till authentication expiration
    // log out and redirect to login page

    if (this.auth.logged && !isException) {
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

  /**
   * // helping function for parsing url string
   * @param {string} url - url string i.e. /aa/bb/cc?query=asdf
   * @returns string[] - array of url segments, i.e. ['aa', 'bb', 'cc']
   * /
  private getUrlPath(url: string): string[] {
    const tree = this.router.parseUrl(url);
    const segments = _.get(tree, `root.children[${PRIMARY_OUTLET}].segments`, []);
    return segments.map(segment => segment.path);
  }
}
*/
