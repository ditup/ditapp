import { UserTag } from 'app/models/user-tag';

export interface State {
  byId: {
    [id: string]: UserTag
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
