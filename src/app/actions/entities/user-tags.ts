/**
 * User Tag entities
 */

import { Action } from '@ngrx/store';
import { UserTag as UserTagModel } from 'app/models/user-tag';

export enum UserTagActionTypes {
  USER_TAG = '[UserTag] UserTag',
  USER_TAGS = '[UserTag] UserTags',
  REMOVE_USER_TAG = '[UserTag] Remove UserTag'
}

export class UserTag implements Action {
  readonly type = UserTagActionTypes.USER_TAG

  constructor(public payload: UserTagModel) { }
}

export class RemoveUserTag implements Action {
  readonly type = UserTagActionTypes.REMOVE_USER_TAG

  constructor(public payload: UserTagModel) { }
}

export class UserTags implements Action {
  readonly type = UserTagActionTypes.USER_TAGS

  constructor(public payload: UserTagModel[]) { }
}

export type UserTagActions =
  | UserTag
  | UserTags
  | RemoveUserTag
