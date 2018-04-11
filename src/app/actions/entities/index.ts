/**
 * actions to handle entities
 */

import { Action } from '@ngrx/store';
import { User } from 'app/models/user';
import { Tag } from 'app/models/tag';
import { UserTag } from 'app/models/user-tag';

export enum EntitiesActionTypes {
  ADD_USER_TAG = '[Entities] Add UserTag',
  REMOVE_USER_TAG = '[Entities] Remove UserTag'
}

export class AddUserTag implements Action {
  readonly type = EntitiesActionTypes.ADD_USER_TAG

  constructor(public payload: { user: User, tag: Tag, userTag: UserTag }) { }
}

export class RemoveUserTag implements Action {
  readonly type = EntitiesActionTypes.REMOVE_USER_TAG

  constructor(public payload: UserTag) { }
}

export type EntitiesActions =
  | AddUserTag
  | RemoveUserTag
