import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { UserEffects } from './users';
import { map, switchMap } from 'rxjs/operators';
import { AddUserTag, RemoveUserTag, EntitiesActionTypes } from 'app/actions/entities';
import { User, AddUserTagIdToUser, RemoveUserTagIdFromUser } from 'app/actions/entities/users';
import { Tag, AddUserTagIdToTag, RemoveUserTagIdFromTag } from 'app/actions/entities/tags';
import { UserTag, RemoveUserTag as RemoveUserTagSpecific } from 'app/actions/entities/user-tags';

@Injectable()
export class EntitiesEffects {

  constructor(private actions$: Actions) {}

  @Effect()
  addUserTag$ = this.actions$.pipe(
    ofType(EntitiesActionTypes.ADD_USER_TAG),
    map((action: AddUserTag) => action.payload),
    switchMap(({ user, tag, userTag }) => [
      new UserTag(userTag),
      new User(user),
      new Tag(tag),
      new AddUserTagIdToUser({ userId: user.id, userTagId: userTag.id }),
      new AddUserTagIdToTag({ tagId: tag.id, userTagId: userTag.id })
    ])
  );

  @Effect()
  removeUserTag$ = this.actions$.pipe(
    ofType(EntitiesActionTypes.REMOVE_USER_TAG),
    map((action: RemoveUserTag) => action.payload),
    switchMap((userTag) => [
      new RemoveUserTagIdFromUser(userTag),
      new RemoveUserTagIdFromTag(userTag),
      new RemoveUserTagSpecific(userTag)
    ])
  );
}

export const effects = [UserEffects, EntitiesEffects];
