import { Action } from '@ngrx/store';
import { User } from 'app/models/user';
import { Tag } from 'app/models/tag';
import { UserTag } from 'app/models/user-tag';

export enum RouterActionTypes {
  GET_ROUTER_USER = '[Router] Get Router User'
}

export class GetRouterUser implements Action {
  readonly type = RouterActionTypes.GET_ROUTER_USER
}

export type RouterActions =
  | GetRouterUser
