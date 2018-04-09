import { combineReducers } from '@ngrx/store';

import * as fromUsers from './users';
import * as fromUserTags from './user-tags';
import * as fromTags from './tags';

export interface State {
  users: fromUsers.State,
  userTags: fromUserTags.State,
  tags: fromTags.State
}

export const reducers = combineReducers({
  users: fromUsers.reducer,
  userTags: fromUserTags.reducer,
  tags: fromTags.reducer
});
