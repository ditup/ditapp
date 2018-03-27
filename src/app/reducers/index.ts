import { /*createSelector, */ActionReducerMap } from '@ngrx/store';

import * as fromAuth from './auth';

export interface State {
  auth: fromAuth.State
}

export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.reducer
}
