import { Tag } from 'app/models/tag';
import { TagActionTypes, TagActions } from 'app/actions/entities/tags';

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
    default:
      return state;
  }
}
