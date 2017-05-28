import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';
import { Contact } from '../shared/types';

@Injectable()
export class ContactResolver implements Resolve<{ fromMe: Contact, toMe: Contact }> {

  constructor(private model: ModelService,
              private router: Router,
              private auth: AuthService) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<{ fromMe: Contact, toMe: Contact }> {
    let username = route.params['username'];
    let me = this.auth.username;
    try {
      const fromMe = await this.model.readContact(me, username);
      const toMe = await this.model.readContact(username, me);
      return { fromMe, toMe };
    } catch (e) {
      return null;
    }
  }
}
