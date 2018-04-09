import { /*createSelector, */ActionReducerMap } from '@ngrx/store';
import { InjectionToken } from '@angular/core';
import { AppNotification } from 'app/models/app-notification';
import { User } from 'app/models/user';
import { UserTag } from 'app/models/user-tag';

import * as fromAuth from './auth';
// import * as fromUsers from './entities/users';
import * as fromEntities from './entities';
// reducers for user-edit are included in reducers for auth since we are editing the logged user within auth
//
import * as fromAppNotify from './app-notify';
// import * as fromUi from './ui';

export interface State {
  auth: fromAuth.State,
  entities: fromEntities.State,
  appNotifications: fromAppNotify.State
}

export const reducerToken = new InjectionToken<ActionReducerMap<State>>('Reducers');

export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.reducer,
  entities: fromEntities.reducers,
  appNotifications: fromAppNotify.reducer,
  // ui: fromUi.reducer
}

export const getAuthUser = (state: State): User => {
  const userId = state.auth.userId;
  return state.entities.users.byId[userId];
};

export const getAuthUserTags = (state: State): UserTag[]|null => {
  const userId = state.auth.userId;
  const user: User = state.entities.users.byId[userId];
  if (!user.userTags) return null;
  return user.userTags.map(userTagId => state.entities.userTags.byId[userTagId]);
};

export function getReducers() {
  return {
    appNotifications: fromAppNotify.reducer,
    auth: fromAuth.reducer,
    entities: fromEntities.reducers,
    // ui: fromUi.reducers
  };
}

export const getAppNotifications = (state: State): AppNotification[] => state.appNotifications.allIds.map(id => state.appNotifications.byId[id])


export const reducerProvider = [
  { provide: reducerToken, useFactory: getReducers }
]

/*
import { ActionReducerMap, combineReducers } from '@ngrx/store'

import * as fromApp from './appReducers'
import * as fromNested from './nestedReducers'
import { InjectionToken } from '@angular/core';

export interface IState {
    app: {
        a: fromApp.IState,
        b: fromNested.IState,
    }
}

export const reducers = combineReducers({
    a: fromApp.reducer,
    b: fromNested.reducer,
});

export const reducerToken = new InjectionToken<ActionReducerMap<IState>>('Reducers');

export function getReducers() {
    return {
      app: reducers,
    };
}

export const reducerProvider = [
    { provide: reducerToken, useFactory: getReducers }
];
*/
