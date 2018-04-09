import { UserTag } from 'app/models/user-tag';
import { UserTagActionTypes, UserTagActions } from 'app/actions/entities/user-tags';

export interface State {
  byId: {
    [id: string]: UserTag
  },
  allIds: string[] // array of userTag ids
}

export const initialState: State = {
  byId: {},
  allIds: []
}

export function reducer(state=initialState, action: UserTagActions): State {
  switch (action.type) {
    case UserTagActionTypes.USER_TAG: {
      const userTag = action.payload;
      const exists = !!state.byId[userTag.id];

      return {
        byId: { ...state.byId, [userTag.id]: userTag },
        allIds: exists ? state.allIds : [...state.allIds, userTag.id]
      };
    }
    case UserTagActionTypes.USER_TAGS: {
      const userTags = action.payload;

      const addedUserTags = {};
      userTags.forEach(userTag => addedUserTags[userTag.id] = userTag);

      const newUserTagIds = userTags.filter(userTag => !state.allIds.includes(userTag.id)).map(userTag => userTag.id);

      return {
        byId: { ...state.byId, ...addedUserTags },
        allIds: [...state.allIds, ...newUserTagIds]
      };
    }
    default:
      return state;
  }
}
