import { Tag } from 'app/models/tag';

export interface State {
  byId: {
    [id: string]: Tag
  },
  allIds: string[] // array of user ids
}

export const initialState: State = {
  byId: {},
  allIds: []
}

export function reducer(state=initialState, action): State {
  switch (action.type) {
    default:
      return state;
  }
}
