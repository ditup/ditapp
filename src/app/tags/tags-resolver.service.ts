import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ModelService } from '../model.service';
import { Tag } from '../shared/types';

@Injectable()
export class TagsRelatedToMyTagsResolver implements Resolve<Tag[]> {

  constructor(private model: ModelService) { }

  async resolve(): Promise<Tag[]> {
    return await this.model.findTagsByMyTags();
  }
}

@Injectable()
export class RandomTagsResolver implements Resolve<Tag[]> {

  constructor(private model: ModelService) { }

  async resolve(): Promise<Tag[]> {
    return await this.model.findRandomTags();
  }
}

@Injectable()
export class TagsRelatedToTagResolver implements Resolve<Tag[]> {
  constructor(private model: ModelService) { }

  async resolve(route: ActivatedRouteSnapshot): Promise<Tag[]> {
    const tagname: string = route.params['tagname'];
    return await this.model.findTagsByTags([{ tagname }]);
  }
}
