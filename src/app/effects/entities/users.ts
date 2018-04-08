import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { flatMap, map, withLatestFrom } from 'rxjs/operators';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { zip } from 'rxjs/observable/zip';


import { UserActionTypes, User, UserWithAvatar } from 'app/actions/entities/users';
import { State } from 'app/reducers';
import { ModelService } from 'app/model.service';

@Injectable()
export class UserEffects {

  constructor(private actions$: Actions,
              private store$: Store<State>,
              private modelService: ModelService) {}

  /**
   * we fetch user avatar if user was added and doesn't have avatar
   */
  @Effect()
  enrichUserWithAvatar$ = this.actions$.pipe(
    ofType(UserActionTypes.USER),
    map((action: User) => action.payload),
    withLatestFrom(this.store$),
    flatMap(([user, state]) => {
      const userInState = state.entities.users.byId[user.id]
      if (userInState && userInState.avatar) {
        return of(new UserWithAvatar({ ...user, avatar: userInState.avatar }))
      } else {
        return zip(
          fromPromise(this.modelService.readAvatar(user.id, 16)),
          fromPromise(this.modelService.readAvatar(user.id, 32)),
          fromPromise(this.modelService.readAvatar(user.id, 64)),
          fromPromise(this.modelService.readAvatar(user.id, 128)),
          fromPromise(this.modelService.readAvatar(user.id, 256)),
          (avatar16, avatar32, avatar64, avatar128, avatar256) => ({
            16: avatar16, 32: avatar32, 64: avatar64, 128: avatar128, 256: avatar256
          })
        ).pipe(
          map((avatar) => {
            return new UserWithAvatar({ ...user, avatar })
          })
        )
      }
    })
  );


}
