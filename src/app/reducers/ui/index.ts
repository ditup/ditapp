import { combineReducers } from '@ngrx/store';

import * as fromUserEditPage from './user-edit-page';
import * as fromUserPage from './user-page';

export interface State {
  userEditPage: fromUserEditPage.State,
  userPage: fromUserPage.State,
}

export const reducers = combineReducers({
  userEditPage: fromUserEditPage.reducer,
  userPage: fromUserPage.reducer
});
