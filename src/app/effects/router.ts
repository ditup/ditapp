import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { map, tap, flatMap, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { Authenticate } from 'app/models/auth';
import { RouterActionTypes } from 'app/actions/router';
import * as fromUserActions from 'app/actions/entities/users';
import * as fromRoot from 'app/reducers';
import { User as UserModel } from 'app/models/user';
import { ModelService } from 'app/model.service';
import { Store, select } from '@ngrx/store';

@Injectable()
export class RouterEffects {
  constructor(private actions$: Actions,
              private model: ModelService,
              private store: Store<fromRoot.State>

             ) {}

  // get user's data after login
  @Effect()
  getRouterUser$ = this.actions$.pipe(
    ofType(RouterActionTypes.GET_ROUTER_USER),
    switchMap(() => this.store.pipe(select(fromRoot.getRouteId))),
    flatMap((userId) =>
      Observable.fromPromise(this.model.readUser(userId))
        .pipe(
          switchMap((user: UserModel) => [
            new fromUserActions.User(user)
          ])
        )
    )
  );
}

/*
import {
  Login,
  LoginSuccess,
  Logout,
  GetSelfDataSuccess,
  AuthActionTypes
} from 'app/actions/auth';

import { User } from 'app/actions/entities/users';

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
          switchMap((user) => [
            new GetSelfDataSuccess({ user }),
            new User(user)
          ])
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
*/
