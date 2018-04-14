import { combineReducers } from '@ngrx/store';

import * as fromUserEditPage from './user-edit-page';

export interface State {
  userEditPage: fromUserEditPage.State,
}

export const reducers = combineReducers({
  userEditPage: fromUserEditPage.reducer
});
