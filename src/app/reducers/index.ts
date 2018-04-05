import { /*createSelector, */ActionReducerMap } from '@ngrx/store';
import { AppNotification } from 'app/models/app-notification';

import * as fromAuth from './auth';
// import * as fromUsers from './entities/users';
import * as fromEntities from './entities';
// reducers for user-edit are included in reducers for auth since we are editing the logged user within auth
//
import * as fromAppNotify from './app-notify';

export interface State {
  auth: fromAuth.State,
  entities: fromEntities.State,
  appNotifications: fromAppNotify.State
}

export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.reducer,
  entities: fromEntities.reducers,
  appNotifications: fromAppNotify.reducer
}

export const getAuthUser = (state: State) => {
  const userId = state.auth.userId;
  return state.entities.users[userId];
};

export const getAppNotifications = (state: State): AppNotification[] => state.appNotifications.allIds.map(id => state.appNotifications.byId[id])
