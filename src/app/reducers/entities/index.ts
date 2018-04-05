import { ActionReducerMap } from '@ngrx/store';

import * as fromUsers from './users';

export interface State {
  users: fromUsers.State
}

export const reducers: ActionReducerMap<State> = {
  users: fromUsers.reducer,
}
