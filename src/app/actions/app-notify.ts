/**
 * actions
 * ADD_APP_NOTIFY
 *  will add AppNotification to list of notifications (reducers)
 *
 * REMOVE_APP_NOTIFY
 *  will remove AppNotification with given Id from list of notifications
 *
 *
 *
 *
 */

import { Action } from '@ngrx/store';
import { AppNotification } from 'app/models/app-notification';

export enum AppNotifyActionTypes {
  ADD_APP_NOTIFICATION = '[App Notify] Add Notification',
  REMOVE_APP_NOTIFICATION = '[App Notify] Remove Notification',
  NOTIFY = '[App Notify] Notify'
}

export class Notify implements Action {
  readonly type = AppNotifyActionTypes.NOTIFY

  constructor(public payload: { type: 'info' | 'error', message: string }) { }
}

export class AddAppNotification implements Action {
  readonly type = AppNotifyActionTypes.ADD_APP_NOTIFICATION

  constructor(public payload: AppNotification) { }
}

export class RemoveAppNotification implements Action {
  readonly type = AppNotifyActionTypes.REMOVE_APP_NOTIFICATION

  constructor(public payload: string) { } // payload is notification id
}

export type AppNotifyActions =
  | AddAppNotification
  | Notify
  | RemoveAppNotification
