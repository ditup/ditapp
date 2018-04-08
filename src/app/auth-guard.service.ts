import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, flatMap, map } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import { AuthService } from 'app/services/auth';
import { ModelService } from 'app/model.service';
import * as authActions from 'app/actions/auth';
import * as userActions from 'app/actions/entities/users';
import { loginBeforeAuthExp } from 'app/config';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import * as fromRoot from 'app/reducers';
import { Store, select } from '@ngrx/store';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private store: Store<fromRoot.State>,
              private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> {
    const url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): Observable<boolean> {
    // if logged in, continue
    //
    return this.store.pipe(
      select('auth'),
      map(({ logged, loggedUnverified, user }) => {
        console.log('guard', logged, loggedUnverified, user)
        if (logged) {
          console.log('allowed');
          return true;
        }
        if (loggedUnverified) {
          this.router.navigate([`/user/${user.username}/verify-email`], {
            queryParams: { redirect: url }
          });
        } else {
          // otherwise go to login page
          this.router.navigate(['/login'], {
            queryParams: { redirect: url }
          });
        }
        return false;
      })
    )
  }
}

/**
 * With this guard we check if user was logged in (local storage).
 * And see if the token won't expire soon.
 * And fetch user data and login.
 * Otherwise log out or do nothing.
 */
@Injectable()
export class AuthExpGuard implements CanActivate {

  constructor(private store: Store<fromRoot.State>,
              private modelService: ModelService,
              private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    return this.persistentLogin();
  }

  /**
   * We login from local storage
   * and if the login is persisted there, we check that it's not going to expire soon.
   * This should happen on the application start or reload.
   */
  private persistentLogin(): Observable<boolean> {
    // get authentication data from local storage
    const auth = this.authService.loginFromStore()
    // if the token is stored there, let's see when it will expire
    if (auth.token) {
      // asking api when the token will expire
      return this.modelService.authExpiration(auth.token).pipe(
        // if it's going to expire soon, let's break out of the chain and log out
        map((validityPeriod) => {
          if (validityPeriod < loginBeforeAuthExp) {
            throw(new Error('logout'));
          }

          return true;
        }),
        // get the detailed logged user's info
        flatMap(() => {
          return Observable.fromPromise(this.modelService.readUser(auth.userId, { token: auth.token }))
        }),
        // log in
        map(user => {
          const enrichedAuth = {
            ...auth,
            user
          }
          this.store.dispatch(new authActions.InitialLoginSuccess(enrichedAuth))
          this.store.dispatch(new userActions.User(enrichedAuth.user))
          return true;
        }),
        // log out if logout error was thrown
        catchError(e => {
          if (e.message === 'logout') {
            this.store.dispatch(new authActions.Logout({ redirect: false }))
            return Observable.of(true);
          }

          // throw unexpected error
          throw e;
        })
      )
    } else {
      return Observable.of(true);
    }
  }
}
