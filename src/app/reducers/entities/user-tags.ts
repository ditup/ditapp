import { UserTag } from 'app/models/user-tag';
import { UserTagActionTypes, UserTagActions } from 'app/actions/entities/user-tags';
import { removeItem, removeProperty, addToEntityList } from './utils';

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
      return addToEntityList(state, userTag)
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
    case UserTagActionTypes.REMOVE_USER_TAG: {
      const userTag = action.payload;

      return {
        byId: removeProperty(state.byId, userTag.id),
        allIds: removeItem(state.allIds, userTag.id)
      };
    }
    default:
      return state;
  }
}
