import { Action } from '@ngrx/store';
import { Authenticate } from 'app/models/auth';

export enum AuthActionTypes {
  INITIAL_LOGIN = '[Auth] Initial Login',
  INITIAL_LOGIN_SUCCESS = '[Auth] Initial Login Success',
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAILURE = '[Auth] Login Failure',
  GET_SELF_DATA = '[Auth] Get Self Data', // this might not be necessary?
  GET_SELF_DATA_SUCCESS = '[Auth] Get Self Data Success',
  GET_SELF_DATA_FAILURE = '[Auth] Get Self Data Failure',
  LOGOUT = '[Auth] Logout'
}

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
}

export type AuthActions =
  | InitialLogin
  | InitialLoginSuccess
  | Login
  | LoginSuccess
  | LoginFailure
  | GetSelfDataSuccess
  | Logout
