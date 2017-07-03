import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';
import { Contact } from '../shared/types';

@Injectable()
export class ContactResolver implements Resolve<{ fromMe: Contact, toMe: Contact }> {

  constructor(private model: ModelService,
              private auth: AuthService) { }

  async resolve(route: ActivatedRouteSnapshot): Promise<{ fromMe: Contact, toMe: Contact }> {
    const username = route.params['username'];
    const me = this.auth.username;

    if (username === me) {
      throw new Error('self contact');
    }

    try {
      const fromMe = await this.model.readContact(me, username);
      const toMe = await this.model.readContact(username, me);
      return { fromMe, toMe };
    } catch (e) {
      return null;
    }
  }
}
