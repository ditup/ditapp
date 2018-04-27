import { /*createSelector, */ActionReducerMap } from '@ngrx/store';
import { routerReducer, RouterStateSerializer, RouterReducerState } from '@ngrx/router-store';
import { InjectionToken } from '@angular/core';
import { RouterStateSnapshot, Params } from '@angular/router';
import { AppNotification } from 'app/models/app-notification';
import { User } from 'app/models/user';
import { UserTag } from 'app/models/user-tag';
import { getList } from 'app/reducers/entities/utils';

import * as fromAuth from './auth';
// import * as fromUsers from './entities/users';
import * as fromEntities from './entities';
// reducers for user-edit are included in reducers for auth since we are editing the logged user within auth
//
import * as fromAppNotify from './app-notify';
import * as fromUI from './ui';

export interface State {
  auth: fromAuth.State,
  entities: fromEntities.State,
  appNotifications: fromAppNotify.State,
  ui: fromUI.State,
  router: RouterReducerState<RouterStateUrl>
}

export const reducerToken = new InjectionToken<ActionReducerMap<State>>('Reducers');

/*
export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.reducer,
  entities: fromEntities.reducers,
  appNotifications: fromAppNotify.reducer,
  ui: fromUI.reducers
}
*/

export const getAuthUser = (state: State): User => {
  const userId = state.auth.userId;
  return state.entities.users.byId[userId];
};

export const getRouteUser = (state: State): User => {
  const userId = state.router.state.params.id;

  return state.entities.users.byId[userId];
}

export const getRouteId = (state: State): string => {
  return state.router.state.params.id;
}

export const getAuthUserTags = (state: State): UserTag[]|null => {
  const userId = state.auth.userId;
  const user: User = state.entities.users.byId[userId];
  if (!user.userTags) return null;
  return user.userTags.map(userTagId => state.entities.userTags.byId[userTagId]);
};

export const getRouteUserTags = (state: State): UserTag[]|null => {
  const userId = getRouteId(state);
  const user: User = state.entities.users.byId[userId];
  if (!user || !user.userTags) return null;
  return user.userTags.map(userTagId => state.entities.userTags.byId[userTagId]);
};

export const getOrganizedUserEditTags = (state: State): UserTag[][] => {
  const userTags = getAuthUserTags(state) || []
  const tagsUI = state.ui.userEditPage.tags;
  const userTagsAdded = userTags.filter(userTag => tagsUI.added.includes(userTag.id))
  const userTagsWithoutAdded = userTags.filter(userTag => !tagsUI.added.includes(userTag.id))

  // let's see which tags have relevance edited.
  // We want to have both the old and the new one in the editing list.
  const userTagsEditingRelevance = getList(tagsUI.update)
    .filter(userTag => userTag.relevance)
    // add the story of each user tag to it
    .map(userTag => {
      userTag.story = state.entities.userTags.byId[userTag.id].story;
      return userTag;
    });

  const userTagsJoined = [...userTagsWithoutAdded, ...userTagsEditingRelevance];

  return [
    [...userTagsAdded, ...tagsUI.add.allIds.map(id => tagsUI.add.byId[id])],
    userTagsJoined.filter(userTag => userTag.relevance === 1),
    userTagsJoined.filter(userTag => userTag.relevance === 2),
    userTagsJoined.filter(userTag => userTag.relevance === 3),
    userTagsJoined.filter(userTag => userTag.relevance === 4),
    userTagsJoined.filter(userTag => userTag.relevance === 5)
  ]
}

export const getUserEditPageUI = (state: State) => {
  return state.ui.userEditPage;
}

export function getReducers() {
  return {
    appNotifications: fromAppNotify.reducer,
    auth: fromAuth.reducer,
    entities: fromEntities.reducers,
    ui: fromUI.reducers,
    router: routerReducer
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
export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

// copy pasted from @ngrx example (for router-store)
export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;

    const params = {};

    while (route.firstChild) {
      route = route.firstChild;
      Object.assign(params, route.params);
    }

    const { url, root: { queryParams } } = routerState;

    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return { url, params, queryParams };
  }
}
