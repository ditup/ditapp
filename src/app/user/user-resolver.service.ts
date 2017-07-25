import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';
import { User } from '../shared/types';

@Injectable()
export class UserResolver implements Resolve<User> {

  constructor(private model: ModelService, private router: Router) { }

  async resolve(route: ActivatedRouteSnapshot): Promise<User> {
    const username = route.params['username'];
    try {
      const user = await this.model.readUser(username);
      return user;
    } catch (e) {
      this.router.navigate([`/user/${username}/404`]);
      return null;
    }
  }
}

@Injectable()
export class LoggedUserResolver implements Resolve<User> {

  constructor(private model: ModelService, private auth: AuthService) { }

  async resolve(): Promise<User> {
    const username = this.auth.username;
    const user = await this.model.readUser(username);
    return user;
  }
}
