import { UserActionTypes, UserActions } from 'app/actions/entities/users';
import { removeItem, addItem } from './utils';

import { User } from 'app/models/user';
import { UserTag } from 'app/models/user-tag';

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
    case UserActionTypes.USER_ENRICHED:
    case UserActionTypes.USER: {
      const user = action.payload;
      const exists = !!state.byId[user.id];
      const userFromState = state.byId[user.id] || {};

      const composedUser = {...userFromState, ...user};

      return {
        byId: { ...state.byId, [user.id]: composedUser },
        allIds: exists ? state.allIds : [...state.allIds, user.id]
      };
    }
    case UserActionTypes.ADD_USER_TAG_ID_TO_USER: {
      const { userId, userTagId, append } = action.payload;

      const user = state.byId[userId];

      return {
        ...state,
        byId: { ...state.byId, [userId]: { ...user, userTags: addItem(user.userTags, userTagId, append) } }
      }
    }
    case UserActionTypes.REMOVE_USER_TAG_ID_FROM_USER: {
      const userTag: UserTag = action.payload;
      const user = state.byId[userTag.userId];

      return {
        ...state,
        byId: { ...state.byId, [userTag.userId]: { ...user, userTags: removeItem(user.userTags, userTag.id) } }
      }
    }

    default:
      return state;
  }
}
