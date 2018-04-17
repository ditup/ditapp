/**
 * USER
 */

import { Action } from '@ngrx/store';
import { User as UserModel } from 'app/models/user';
import { UserTag as UserTagModel } from 'app/models/user-tag';

export enum UserActionTypes {
  USER = '[User] User',
  USER_ENRICHED = '[User] User Enriched',
  ADD_USER_TAG_ID_TO_USER = '[User] Add UserTagId To User',
  REMOVE_USER_TAG_ID_FROM_USER = '[User] Remove UserTagId From User'
}

export class User implements Action {
  readonly type = UserActionTypes.USER

  constructor(public payload: UserModel) { }
}

export class UserEnriched implements Action {
  readonly type = UserActionTypes.USER_ENRICHED

  constructor(public payload: UserModel) { }
}

export class AddUserTagIdToUser implements Action {
  readonly type = UserActionTypes.ADD_USER_TAG_ID_TO_USER

  constructor(public payload: { userId: string, userTagId: string, append?: boolean }) { }
}

export class RemoveUserTagIdFromUser implements Action {
  readonly type = UserActionTypes.REMOVE_USER_TAG_ID_FROM_USER

  constructor(public payload: UserTagModel) { }
}

export type UserActions =
  | User
  | UserEnriched
  | AddUserTagIdToUser
  | RemoveUserTagIdFromUser
