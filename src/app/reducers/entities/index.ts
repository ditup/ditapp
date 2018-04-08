import { combineReducers } from '@ngrx/store';

import * as fromUsers from './users';

export interface State {
  users: fromUsers.State
}

export const reducers = combineReducers({
  users: fromUsers.reducer,
});
