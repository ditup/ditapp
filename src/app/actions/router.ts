import { Action } from '@ngrx/store';

export enum RouterActionTypes {
  GET_ROUTER_USER = '[Router] Get Router User'
}

export class GetRouterUser implements Action {
  readonly type = RouterActionTypes.GET_ROUTER_USER
}

export type RouterActions =
  | GetRouterUser
