import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, delay, filter } from 'rxjs/operators';


import { AppNotifyActionTypes, AddAppNotification, RemoveAppNotification, Notify } from 'app/actions/app-notify';

@Injectable()
export class AppNotifyEffects {

  constructor(private actions$: Actions) {}

  /**
   * Here we generate id (random string) and created (timestamp) for notification
   */
  @Effect()
  $enrichAppNotification = this.actions$.pipe(
    ofType(AppNotifyActionTypes.NOTIFY),
    map((action: Notify) => action.payload),
    map(data => ({
      ...data,
      created: Date.now(),
      id: Math.random() + ''
    })),
    map(data => new AddAppNotification(data))
  );

  /**
   * If the notification is info, we remove it in 5 seconds
   */
  @Effect()
  $limitedLifeNotification = this.actions$.pipe(
    ofType(AppNotifyActionTypes.ADD_APP_NOTIFICATION),
    map((action: AddAppNotification) => action.payload),
    filter(data => data.type === 'info'),
    delay(5000),
    map(data => new RemoveAppNotification(data.id))

  );
}
