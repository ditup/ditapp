import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';
import { UserTag } from '../shared/types';

@Injectable()
export class LoggedUserTagsResolver implements Resolve<UserTag[]> {

  constructor(private model: ModelService, private auth: AuthService) { }

  async resolve(): Promise<UserTag[]> {
    const username = this.auth.username;
    const userTags = await this.model.readUserTags(username);
    return userTags;
  }
}
