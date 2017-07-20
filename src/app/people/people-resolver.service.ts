import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ModelService } from '../model.service';
import { User } from '../shared/types';

@Injectable()
export class PeopleWithMyTagsResolver implements Resolve<User[]> {

  constructor(private model: ModelService) { }

  async resolve(): Promise<User[]> {
    return await this.model.findUsersByMyTags();
  }
}

@Injectable()
export class NewPeopleResolver implements Resolve<User[]> {

  constructor(private model: ModelService) { }

  async resolve(): Promise<User[]> {
    return await this.model.findNewUsers();
  }
}
