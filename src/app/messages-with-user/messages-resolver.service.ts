import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ModelService } from '../model.service';
import { Message } from 'app/models/message';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {

  constructor(private model: ModelService) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<Message[]> {
    const username: string = route.params['username'];

    return await this.model.readMessagesWith(username);
  }
}
