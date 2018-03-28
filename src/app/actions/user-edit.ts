import { Action } from '@ngrx/store';

export enum UserEditActionTypes {
  USER_EDIT_PROFILE = '[User Edit] Profile',
  USER_EDIT_PROFILE_SUCCESS = '[User Edit] Profile Success',
  USER_EDIT_PROFILE_FAILURE = '[User Edit] Profile Failure',
  USER_EDIT_LOCATION = '[User Edit] Location',
  USER_EDIT_LOCATION_SUCCESS = '[User Edit] Location Success',
  USER_EDIT_LOCATION_FAILURE = '[User Edit] Location Failure',
}

export class UserEditProfile implements Action {
  readonly type = UserEditActionTypes.USER_EDIT_PROFILE
}

export class UserEditProfileSuccess implements Action {
  readonly type = UserEditActionTypes.USER_EDIT_PROFILE_SUCCESS
}

export type userEditActions =
  | UserEditProfile
  | UserEditProfileSuccess

/*
// TODO this is not used
export class InitialLogin implements Action {
  readonly type = AuthActionTypes.INITIAL_LOGIN
}

export class InitialLoginSuccess implements Action {
  readonly type = AuthActionTypes.INITIAL_LOGIN_SUCCESS
  constructor(public payload: any) {} // TODO better type
}

export class Login implements Action {
  readonly type = AuthActionTypes.LOGIN
  constructor(public payload: Authenticate) {}
}

export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS
  constructor(public payload: any) {} // TODO better type
}

export class LoginFailure implements Action {
  readonly type = AuthActionTypes.LOGIN_FAILURE
}

// TODO this is not used
export class GetSelfData implements Action {
  readonly type = AuthActionTypes.GET_SELF_DATA
}

export class GetSelfDataSuccess implements Action {
  readonly type = AuthActionTypes.GET_SELF_DATA_SUCCESS
  constructor(public payload: any) {} // TODO better type
}

export class GetSelfDataFailure implements Action {
  readonly type = AuthActionTypes.GET_SELF_DATA_FAILURE
}

export class Logout implements Action {
  readonly type = AuthActionTypes.LOGOUT
  constructor(public payload: { redirect?: boolean } = { redirect: true }) {}
}

export type AuthActions =
  | InitialLogin
  | InitialLoginSuccess
  | Login
  | LoginSuccess
  | LoginFailure
  | GetSelfDataSuccess
  | Logout
  */
