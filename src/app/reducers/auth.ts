import { User } from 'app/models/user';
import { AuthActions, AuthActionTypes } from 'app/actions/auth';

export interface State {
  logged: boolean,
  loggedUnverified: boolean,
  user: User | null,
  token: string,
  pending?: boolean
}

export const initialState: State = {
  logged: false,
  loggedUnverified: false,
  user: null,
  token: ''
};

export const initialPendingState: State = {
  logged: false,
  loggedUnverified: false,
  user: null,
  token: '',
  pending: true
};

export function reducer(state = initialPendingState, action: AuthActions): State {
  switch (action.type) {
    case AuthActionTypes.INITIAL_LOGIN_SUCCESS:
      return (action.payload.user) ? {
        logged: action.payload.verified === true,
        loggedUnverified: action.payload. verified !== true,
        user: action.payload.user,
        token: action.payload.token
      } : initialState;
    case AuthActionTypes.LOGIN_SUCCESS:
      console.log(action.payload)
      return {
        logged: action.payload.verified === true,
        loggedUnverified: action.payload. verified !== true,
        user: action.payload.user,
        token: action.payload.token
      };
    case AuthActionTypes.GET_SELF_DATA_SUCCESS:
      console.log(action.payload)
      return {
        ...state,
        user: action.payload.user,
      }
    case AuthActionTypes.LOGOUT:
      console.log('logout action reducing')
      return initialState;
    default:
      return state;
  }
}
