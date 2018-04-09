/**
 * TAG
 */

import { Action } from '@ngrx/store';
import { Tag as TagModel } from 'app/models/tag';

export enum TagActionTypes {
  TAG = '[Tag] Tag',
  TAGS = '[Tag] Tags'
}

export class Tag implements Action {
  readonly type = TagActionTypes.TAG

  constructor(public payload: TagModel) { }
}

export class Tags implements Action {
  readonly type = TagActionTypes.TAGS

  constructor(public payload: TagModel[]) { }
}

export type TagActions =
  | Tag
  | Tags
