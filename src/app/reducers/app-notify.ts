import { AppNotifyActions, AppNotifyActionTypes } from 'app/actions/app-notify';
import { AppNotification } from 'app/models/app-notification';

export interface State {
  byId: {
    [id: string]: AppNotification
  },
  allIds: string[]
}

export const initialState: State = {
  byId: {},
  allIds: []
};

export function reducer(state = initialState, action: AppNotifyActions): State {
  switch (action.type) {
    case AppNotifyActionTypes.ADD_APP_NOTIFICATION:
      return {
        byId: {
          ...state.byId,
          [action.payload.id]: action.payload
        },
        allIds: [...state.allIds, action.payload.id]
      }
    case AppNotifyActionTypes.REMOVE_APP_NOTIFICATION:
      const byId = {...state.byId}
      delete byId[action.payload]
      return {
        byId,
        allIds: state.allIds.filter(notifyId => notifyId !== action.payload)
      }
    default:
      return state;
  }
}

/*
import { AuthActions, AuthActionTypes } from 'app/actions/auth';
// import { UserEditActions, UserEditActionTypes } from 'app/actions/user-edit';

export interface State {
  logged: boolean,
  loggedUnverified: boolean,
  userId: string, // user id (username)
  token: string, // jwt authorization token
  pending?: boolean
}

export const initialState: State = {
  logged: false,
  loggedUnverified: false,
  userId: '',
  token: ''
};

export const initialPendingState: State = {
  logged: false,
  loggedUnverified: false,
  userId: '',
  token: '',
  pending: true
};

export function reducer(state = initialPendingState, action: AuthActions): State {
  switch (action.type) {
    case AuthActionTypes.INITIAL_LOGIN_SUCCESS:
      return (action.payload.user) ? {
        logged: action.payload.verified === true,
        loggedUnverified: action.payload. verified !== true,
        userId: action.payload.userId,
        token: action.payload.token
      } : initialState;
    case AuthActionTypes.LOGIN_SUCCESS:
      console.log(action.payload)
      return {
        logged: action.payload.verified === true,
        loggedUnverified: action.payload. verified !== true,
        userId: action.payload.userId,
        token: action.payload.token
      };
    case AuthActionTypes.GET_SELF_DATA_SUCCESS:
      console.log(action.payload)
      return {
        ...state,
        userId: action.payload.userId,
      }
    case AuthActionTypes.LOGOUT:
      console.log('logout action reducing')
      return initialState;
    /*
    case UserEditActionTypes.USER_EDIT_PROFILE_SUCCESS:
      return {
        ...state,
        userId: {
          ...state.user,
          ...action.payload
        }
      }
      * /
    default:
      return state;
  }
}
*/
