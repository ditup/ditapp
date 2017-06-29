import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { ModelService } from '../model.service';
import { Tag } from '../shared/types';

@Injectable()
export class TagResolver implements Resolve<Tag> {

  constructor(private model: ModelService) { }

  async resolve(route: ActivatedRouteSnapshot): Promise<Tag> {
    const tagname = route.params['tagname'];
    try {
      return await this.model.readTag(tagname);
    }
    catch(e) {
      if (e.status === 404) return null;
      throw e;
    }
  }
}
