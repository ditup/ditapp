/**
 * USER
 */

import { Action } from '@ngrx/store';
import { User as UserModel } from 'app/models/user';

export enum UserActionTypes {
  USER = '[User] User',
  USER_WITH_AVATAR = '[User] User With Avatar'
}

export class User implements Action {
  readonly type = UserActionTypes.USER

  constructor(public payload: UserModel) { }
}

export class UserWithAvatar implements Action {
  readonly type = UserActionTypes.USER_WITH_AVATAR

  constructor(public payload: UserModel) { }
}

export type UserActions =
  | User
  | UserWithAvatar
