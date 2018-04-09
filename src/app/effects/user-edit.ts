import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { flatMap, switchMap, map } from 'rxjs/operators';

import { ModelService } from 'app/model.service';
import { User as UserModel } from 'app/models/user';
import { User } from 'app/actions/entities/users';
import { Notify } from 'app/actions/app-notify';

import {
  UserEditProfile,
  UserEditProfileSuccess,
  UserEditActionTypes
} from 'app/actions/user-edit'

@Injectable()
export class UserEditEffects {
  constructor(private actions$: Actions,
              private modelService: ModelService) {}

  @Effect()
  userEditProfile$ = this.actions$.pipe(
    ofType(UserEditActionTypes.USER_EDIT_PROFILE),
    map((action: UserEditProfile) => action.payload),
    flatMap(profile => this.modelService.updateUser('', profile)),
    switchMap((user: UserModel) => [
      new UserEditProfileSuccess(user),
      new User(user),
      new Notify({ type: 'info', message: 'your profile was updated' })
    ])
  )
}

/*
import { Router, ActivatedRoute } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { map, tap, flatMap } from 'rxjs/operators';
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
          map(({ user, verified, token }) => new LoginSuccess({ user, verified, token }))
        )
    )
  )

  // get user's data after login
  @Effect()
  loginSuccess$ = this.actions$.pipe(
    ofType(AuthActionTypes.LOGIN_SUCCESS),
    map((action: LoginSuccess) => action.payload),
    flatMap(({ user: { username } }) =>
      Observable.fromPromise(this.model.readUser(username))
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
*/
