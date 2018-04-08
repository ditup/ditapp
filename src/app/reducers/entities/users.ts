import { UserActionTypes, UserActions } from 'app/actions/entities/users';

import { User } from 'app/models/user';

export interface State {
  byId: {
    [id: string]: User
  },
  allIds: string[] // array of user ids
}

export const initialState: State = {
  byId: {},
  allIds: []
}

export function reducer(state=initialState, action: UserActions): State {
  switch (action.type) {
    case UserActionTypes.USER:
    case UserActionTypes.USER_WITH_AVATAR: {
      const user = action.payload;
      const exists = !!state.byId[user.id];
      const userFromState = state.byId[user.id] || {};

      const composedUser = {...userFromState, ...user};

      return {
        byId: { ...state.byId, [user.id]: composedUser },
        allIds: exists ? state.allIds : [...state.allIds, user.id]
      };
    }
    default:
      return state;
  }
}
