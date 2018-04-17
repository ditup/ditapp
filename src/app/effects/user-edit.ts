import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { flatMap, switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { ModelService } from 'app/model.service';
import { User as UserModel } from 'app/models/user';
import { User } from 'app/actions/entities/users';
import { AddUserTag, RemoveUserTag } from 'app/actions/entities';
import { Notify } from 'app/actions/app-notify';

import {
  UserEditProfile,
  UserEditProfileSuccess,
  CreateUserTag,
  CreateUserTagSuccess,
  CreateUserTagFailure,
  CreateTagAndUserTag,
  UpdateUserTag,
  UpdateUserTagSuccess,
  DeleteUserTag,
  DeleteUserTagSuccess,
  UserTagNotAdded,
  UserEditActionTypes
} from 'app/actions/user-edit'

@Injectable()
export class UserEditEffects {
  constructor(private actions$: Actions,
              private modelService: ModelService) {}

  @Effect()
  userEditProfile$ = this.actions$.pipe(
    ofType(UserEditActionTypes.USER_EDIT_PROFILE),
    map((action: UserEditProfile) => action.payload),
    flatMap(profile => this.modelService.updateUser('', profile)),
    switchMap((user: UserModel) => [
      new UserEditProfileSuccess(user),
      new User(user),
      new Notify({ type: 'info', message: 'your profile was updated' })
    ])
  )

  @Effect()
  createUserTag$ = this.actions$.pipe(
    ofType(UserEditActionTypes.CREATE_USER_TAG),
    map((action: CreateUserTag) => action.payload),
    switchMap(({ id }) => fromPromise(this.modelService.addTagToUser({ tagId: id }))
      .pipe(
        switchMap(({ user, tag, userTag }) => [
          new CreateUserTagSuccess(userTag),
          new AddUserTag({ user, tag, userTag }),
          new Notify({ type: 'info', message: `${userTag.id} created`})
        ]),
        catchError(error => {
          let message = 'Something went wrong.'

          if (error.status === 409) {
            message = 'The tag is already added.'
          }
          return of(null).pipe(switchMap(() => [
            new Notify({ type: 'error', message }),
            new CreateUserTagFailure({ tagId: id })
          ]))
        })
      )
    )
  )

  @Effect()
  createTagAndUserTag$ = this.actions$.pipe(
    ofType(UserEditActionTypes.CREATE_TAG_AND_USER_TAG),
    map((action: CreateTagAndUserTag) => action.payload),
    flatMap(({ id }) => this.modelService.createTag({ id })),
    switchMap((tag) => [
      new CreateUserTag(tag)
    ])
  )

  @Effect()
  updateUserTag$ = this.actions$.pipe(
    ofType(UserEditActionTypes.UPDATE_USER_TAG),
    map((action: UpdateUserTag) => action.payload),
    flatMap((payload) => Promise.all([this.modelService.updateUserTag(payload), Promise.resolve(payload)])),
    switchMap(([{ user, tag, userTag }, payload]) => [
      new UpdateUserTagSuccess(userTag),
      new AddUserTag({ user, tag, userTag, append: payload.relevance !== undefined }),
      ...(payload.story !== undefined) ? [new Notify({ type: 'info', message: 'your story was updated' })] : [],
      ...(payload.relevance !== undefined) ? [new UserTagNotAdded(userTag)] : []
    ])
  )

  @Effect()
  deleteUserTag$ = this.actions$.pipe(
    ofType(UserEditActionTypes.DELETE_USER_TAG),
    map((action: DeleteUserTag) => action.payload),
    flatMap(async (userTag) => { await this.modelService.removeUserTag(userTag); return userTag }),
    switchMap((userTag) => {
      return [
        new DeleteUserTagSuccess(userTag),
        new RemoveUserTag(userTag),
        new UserTagNotAdded(userTag)
      ]
    })
  )
}
