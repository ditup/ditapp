import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { map, tap, flatMap, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { Authenticate } from 'app/models/auth';
import { AuthService } from 'app/services/auth';
import { ModelService } from 'app/model.service';

import {
  Login,
  LoginSuccess,
  Logout,
  GetSelfDataSuccess,
  AuthActionTypes
} from 'app/actions/auth';

import {
  Notify
} from 'app/actions/app-notify';

@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions,
              private authService: AuthService,
              private model: ModelService,
              private route: ActivatedRoute,
              private router: Router) {}

  @Effect()
  login$ = this.actions$.pipe(
    ofType(AuthActionTypes.LOGIN),
    map((action: Login) => action.payload),
    flatMap((auth: Authenticate) =>
      this.authService.login(auth)
        .pipe(
          switchMap(({ userId, verified, token }) => [
            new LoginSuccess({ userId, verified, token }),
            new Notify({ type: 'info', message: 'successfully logged in' })
          ])
        )
    )
  )

  // get user's data after login
  @Effect()
  loginSuccess$ = this.actions$.pipe(
    ofType(AuthActionTypes.LOGIN_SUCCESS),
    map((action: LoginSuccess) => action.payload),
    flatMap(({ userId }) =>
      Observable.fromPromise(this.model.readUser(userId))
        .pipe(
          map((user) => new GetSelfDataSuccess({ user }))
        )
    )
  );

  // after getting user data, redirect
  @Effect({ dispatch: false })
  getSelfDataSuccess$ = this.actions$.pipe(
    ofType(AuthActionTypes.GET_SELF_DATA_SUCCESS),
    tap(() => {
      this.router.navigate([this.route.snapshot.queryParams.redirect || '/'])
    })
  )

  @Effect({ dispatch: false})
  logout$ = this.actions$.pipe(
    ofType(AuthActionTypes.LOGOUT),
    map((action: Logout) => action.payload),
    map((payload) => {
      this.authService.clearPersistentLogin();
      if (payload && payload.redirect)
        this.router.navigate(['/'])
    })
  )
}
/*,
*/
