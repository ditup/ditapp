/**
 * TAG
 */

import { Action } from '@ngrx/store';
import { Tag as TagModel } from 'app/models/tag';
import { UserTag as UserTagModel } from 'app/models/user-tag';

export enum TagActionTypes {
  TAG = '[Tag] Tag',
  TAGS = '[Tag] Tags',
  ADD_USER_TAG_ID_TO_TAG = '[Tag] Add UserTagId To Tag',
  REMOVE_USER_TAG_ID_FROM_TAG = '[Tag] Remove UserTagId From Tag'
}

export class Tag implements Action {
  readonly type = TagActionTypes.TAG

  constructor(public payload: TagModel) { }
}

export class Tags implements Action {
  readonly type = TagActionTypes.TAGS

  constructor(public payload: TagModel[]) { }
}

export class AddUserTagIdToTag implements Action {
  readonly type = TagActionTypes.ADD_USER_TAG_ID_TO_TAG

  constructor(public payload: { tagId: string, userTagId: string }) { }
}

export class RemoveUserTagIdFromTag implements Action {
  readonly type = TagActionTypes.REMOVE_USER_TAG_ID_FROM_TAG

  constructor(public payload: UserTagModel) { }
}

export type TagActions =
  | Tag
  | Tags
  | AddUserTagIdToTag
  | RemoveUserTagIdFromTag
