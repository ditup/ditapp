/**
 * USER
 */

import { Action } from '@ngrx/store';
import { User as UserModel } from 'app/models/user';

export enum UserActionTypes {
  USER = '[User] User',
  USER_ENRICHED = '[User] User Enriched'
}

export class User implements Action {
  readonly type = UserActionTypes.USER

  constructor(public payload: UserModel) { }
}

export class UserEnriched implements Action {
  readonly type = UserActionTypes.USER_ENRICHED

  constructor(public payload: UserModel) { }
}

export type UserActions =
  | User
  | UserEnriched
