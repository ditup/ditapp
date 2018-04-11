import { Action } from '@ngrx/store';
import { User } from 'app/models/user';
import { Tag } from 'app/models/tag';
import { UserTag } from 'app/models/user-tag';

export enum UserEditActionTypes {
  USER_EDIT_PROFILE = '[User Edit] Profile',
  USER_EDIT_PROFILE_SUCCESS = '[User Edit] Profile Success',
  USER_EDIT_PROFILE_FAILURE = '[User Edit] Profile Failure',
  CREATE_USER_TAG = '[User Edit] Create UserTag',
  CREATE_USER_TAG_SUCCESS = '[User Edit] Create UserTag Success',
  CREATE_TAG_AND_USER_TAG = '[User Edit] Create Tag And UserTag',
  UPDATE_USER_TAG = '[User Edit] Update UserTag',
  UPDATE_USER_TAG_SUCCESS = '[User Edit] Update UserTag Success',
  DELETE_USER_TAG = '[User Edit] Delete UserTag',
  DELETE_USER_TAG_SUCCESS = '[User Edit] Delete UserTag Success',
}

export class UserEditProfile implements Action {
  readonly type = UserEditActionTypes.USER_EDIT_PROFILE

  constructor(public payload: any) {} // TODO better type
}

export class UserEditProfileSuccess implements Action {
  readonly type = UserEditActionTypes.USER_EDIT_PROFILE_SUCCESS

  constructor(public payload: User) {}
}

export class CreateUserTag implements Action {
  readonly type = UserEditActionTypes.CREATE_USER_TAG

  constructor(public payload: Tag) { }
}

export class CreateUserTagSuccess implements Action {
  readonly type = UserEditActionTypes.CREATE_USER_TAG_SUCCESS;

  constructor(public payload: Tag) { }
}

export class CreateTagAndUserTag implements Action {
  readonly type = UserEditActionTypes.CREATE_TAG_AND_USER_TAG

  constructor(public payload: Tag) { }
}

export class UpdateUserTag implements Action {
  readonly type = UserEditActionTypes.UPDATE_USER_TAG

  constructor(public payload: any) { } // TODO better type
}

export class UpdateUserTagSuccess implements Action {
  readonly type = UserEditActionTypes.UPDATE_USER_TAG_SUCCESS;

  constructor(public payload: any) { } // TODO better type
}

export class DeleteUserTag implements Action {
  readonly type = UserEditActionTypes.DELETE_USER_TAG

  constructor(public payload: UserTag) { }
}

export class DeleteUserTagSuccess implements Action {
  readonly type = UserEditActionTypes.DELETE_USER_TAG_SUCCESS;

  constructor(public payload: UserTag) { }
}

export type UserEditActions =
  | UserEditProfile
  | UserEditProfileSuccess
  | CreateUserTag
  | CreateUserTagSuccess
  | UpdateUserTag
  | UpdateUserTagSuccess
  | DeleteUserTag
  | DeleteUserTagSuccess

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
