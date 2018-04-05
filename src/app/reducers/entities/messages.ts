import { Message } from 'app/models/message';

export interface State {
  byId: {
    [id: string]: Message
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
