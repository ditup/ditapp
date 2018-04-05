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

export function reducers(state=initialState, action): State {
  switch (action.type) {
    default:
      return state;
  }
}
