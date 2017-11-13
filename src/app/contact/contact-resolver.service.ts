import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';
import { Contact } from '../shared/types';

@Injectable()
export class ContactResolver implements Resolve<{ fromMe: Contact, toMe: Contact }|null|'self'> {

  constructor(private model: ModelService,
              private auth: AuthService) { }

  async resolve(route: ActivatedRouteSnapshot): Promise<{ fromMe: Contact, toMe: Contact }|null|'self'> {
    const username = route.params['username'];
    const me = this.auth.username;

    if (username === me) {
      return 'self';
    }

    try {
      const fromMe = await this.model.readContact(me, username);
      const toMe = await this.model.readContact(username, me);
      return { fromMe, toMe };
    } catch (e) {
      // contact doesn't exist
      if (e.status === 404) {
        return null;
      }

      throw e;
    }
  }
}
