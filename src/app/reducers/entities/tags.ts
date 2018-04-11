import { Tag } from 'app/models/tag';
import { UserTag } from 'app/models/user-tag';
import { TagActionTypes, TagActions } from 'app/actions/entities/tags';
import { removeItem } from './utils';

export interface State {
  byId: {
    [id: string]: Tag
  },
  allIds: string[] // array of tag ids
}

export const initialState: State = {
  byId: {},
  allIds: []
}

export function reducer(state=initialState, action: TagActions): State {
  switch (action.type) {
    case TagActionTypes.TAG: {
      const tag = action.payload;
      if (!tag.userTags) tag.userTags = [];

      const exists = !!state.byId[tag.id];

      return {
        byId: { ...state.byId, [tag.id]: tag },
        allIds: exists ? state.allIds : [...state.allIds, tag.id]
      };
    }
    case TagActionTypes.TAGS: {
      const tags = action.payload;

      const addedTags = {};
      tags.forEach(tag => addedTags[tag.id] = tag);

      const newTagIds = tags.filter(tag => !state.allIds.includes(tag.id)).map(tag => tag.id);

      return {
        byId: { ...state.byId, ...addedTags },
        allIds: [...state.allIds, ...newTagIds]
      };
    }
    case TagActionTypes.ADD_USER_TAG_ID_TO_TAG: {
      const { tagId, userTagId } = action.payload;

      const tag = state.byId[tagId];
      const isInUserTags = tag.userTags.includes(userTagId);

      return (isInUserTags) ?
        state :
        {
          ...state,
          byId: { ...state.byId, [tagId]: { ...tag, userTags: [...tag.userTags, userTagId] } }
        }
    }
    case TagActionTypes.REMOVE_USER_TAG_ID_FROM_TAG: {
      const userTag: UserTag = action.payload;
      const tag = state.byId[userTag.tagId];

      return {
        ...state,
        byId: { ...state.byId, [userTag.tagId]: { ...tag, userTags: removeItem(tag.userTags, userTag.id) } }
      }
    }
    default:
      return state;
  }
}
