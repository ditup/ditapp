export interface State {
  userId: string,
  notFound: boolean
}

export const initialState: State = {
  userId: '',
  notFound: false
};

export function reducer(state=initialState, _action: any): State {
  /*
  switch (action.type) {
    case UserEditActionTypes.CREATE_USER_TAG: {
      const tagId = action.payload.id;
      const userId = 'pending';
      const userTag: UserTag = { id: `${userId}--${tagId}`, userId, tagId, story: '', relevance: 3 };
      return {
        ...state,
        tags: {
          ...state.tags,
          add: addToEntityList(state.tags.add, userTag)
        }
      }
    }
    case UserEditActionTypes.CREATE_USER_TAG_SUCCESS: {
      const { id, tagId } = action.payload;
      const userId = 'pending';
      return {
        ...state,
        tags: {
          ...state.tags,
          add: removeFromEntityList(state.tags.add, `${userId}--${tagId}`),
          added: addItem(state.tags.added, id)
        }
      }
    }
    case UserEditActionTypes.CREATE_USER_TAG_FAILURE: {
      const { tagId } = action.payload;
      const userId = 'pending';
      return {
        ...state,
        tags: {
          ...state.tags,
          add: removeFromEntityList(state.tags.add, `${userId}--${tagId}`)
        }
      }
    }
    case UserEditActionTypes.UPDATE_USER_TAG: {
      const { userId, tagId, story, relevance } = action.payload;
      const id = `${userId}--${tagId}`
      const userTag: UserTag = { id, userId, tagId, story, relevance };

      return {
        ...state,
        tags: {
          ...state.tags,
          update: addToEntityList(state.tags.update, userTag)
        }
      }
    }
    case UserEditActionTypes.UPDATE_USER_TAG_SUCCESS: {
      const { id } = action.payload;
      return {
        ...state,
        tags: {
          ...state.tags,
          update: removeFromEntityList(state.tags.update, id)
        }
      }
    }
    case UserEditActionTypes.USER_TAG_NOT_ADDED: {
      const { id } = action.payload;
      return {
        ...state,
        tags: {
          ...state.tags,
          added: removeItem(state.tags.added, id)
        }
      }
    }
    case UserEditActionTypes.DELETE_USER_TAG: {
      const userTag = action.payload;

      return {
        ...state,
        tags: {
          ...state.tags,
          remove: addToEntityList(state.tags.update, userTag)
        }
      }
    }
    case UserEditActionTypes.DELETE_USER_TAG_SUCCESS: {
      const { id } = action.payload;
      return {
        ...state,
        tags: {
          ...state.tags,
          remove: removeFromEntityList(state.tags.update, id)
        }
      }
    }
    default: {
      return state;
    }
  }
  */
  return state;
}


/*
import { UserTag } from 'app/models/user-tag';
import { UserTagActionTypes, UserTagActions } from 'app/actions/entities/user-tags';
import { removeItem, removeProperty } from './utils';

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
*/
