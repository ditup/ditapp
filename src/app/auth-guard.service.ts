import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import { AuthService } from 'app/services/auth';
import * as authActions from 'app/actions/auth';
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

    /*
    if (this.auth.logged) {
      return true;
    }

    if (this.auth.loggedUnverified) {
      // if unverified, go to verify-email page
      this.router.navigate([`/user/${this.auth.username}/verify-email`], {
        queryParams: { redirect: url }
      });
    } else {
    }

    return Observable.of(false);
    */
  }
}

@Injectable()
export class AuthExpGuard implements CanActivate {

  constructor(private store: Store<fromRoot.State>,
              private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    return this.persistentLogin();
  }

  private persistentLogin(): Observable<boolean> {
    const auth = this.authService.loginFromStore()
    this.store.dispatch(new authActions.InitialLoginSuccess(auth))
    return Observable.of(true)
  }

    /*
    if (this.auth.logged) {
      return true;
    }

    if (this.auth.loggedUnverified) {
      // if unverified, go to verify-email page
      this.router.navigate([`/user/${this.auth.username}/verify-email`], {
        queryParams: { redirect: url }
      });
    } else {
    }

    return Observable.of(false);
    */
}
/*
  resolve(): Observable<Auth> {
    this.initLogin();

    return this.waitForInitLogin();
  }

  initLogin(): void {
    const auth = this.authService.loginFromStore()
    this.store.dispatch(new authActions.InitialLoginSuccess(auth))
  }

  waitForInitLogin(): Observable<Auth> {
    return this.store.pipe(
      select('auth'),
      filter((auth: Auth) => !auth.pending),
      take(1)
    )
  }
  */
