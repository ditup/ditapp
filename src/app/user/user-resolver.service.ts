import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ModelService } from '../model.service';
// import { AuthService } from '../auth.service';
import { User } from 'app/models/user';
import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/reducers';

@Injectable()
export class UserResolver implements Resolve<User> {

  constructor(private model: ModelService) { }

  async resolve(route: ActivatedRouteSnapshot): Promise<User> {
    const username = route.params['username'];
    try {
      const user = await this.model.readUser(username);
      return user;
    } catch (e) {
      return null;
    }
  }
}

@Injectable()
export class LoggedUserResolver implements Resolve<User> {

  constructor(private model: ModelService,
              private store: Store<fromRoot.State>) { }

  async resolve(): Promise<User> {
    const user = await this.store.pipe(select(fromRoot.getAuthUser)).take(1).toPromise()
    return await this.model.readUser(user.id);
  }
}
