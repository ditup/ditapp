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
  USER_TAG_NOT_ADDED = '[User Edit] UserTag Not Added', // remove user_tag from freshly added tags
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

  constructor(public payload: UserTag) { }
}

export class CreateTagAndUserTag implements Action {
  readonly type = UserEditActionTypes.CREATE_TAG_AND_USER_TAG

  constructor(public payload: Tag) { }
}

export class UpdateUserTag implements Action {
  readonly type = UserEditActionTypes.UPDATE_USER_TAG

  constructor(public payload: { userId: string, tagId: string, story?: string, relevance?: number }) { }
}

export class UpdateUserTagSuccess implements Action {
  readonly type = UserEditActionTypes.UPDATE_USER_TAG_SUCCESS;

  constructor(public payload: UserTag) { }
}

export class DeleteUserTag implements Action {
  readonly type = UserEditActionTypes.DELETE_USER_TAG

  constructor(public payload: UserTag) { }
}

export class DeleteUserTagSuccess implements Action {
  readonly type = UserEditActionTypes.DELETE_USER_TAG_SUCCESS;

  constructor(public payload: UserTag) { }
}

// removes userTag id from the added ones
export class UserTagNotAdded implements Action {
  readonly type = UserEditActionTypes.USER_TAG_NOT_ADDED;

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
  | UserTagNotAdded
