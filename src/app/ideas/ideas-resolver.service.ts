import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ModelService } from '../model.service';
import { Comment, Idea, Tag } from '../shared/types';

@Injectable()
export class IdeaResolver implements Resolve<Idea> {

  constructor(private model: ModelService) { }

  async resolve(route: ActivatedRouteSnapshot): Promise<Idea> {
    const id: string = route.params['id'];
    return await this.model.readIdea(id);
  }
}

@Injectable()
export class IdeaTagsResolver implements Resolve<Tag[]> {

  constructor(private model: ModelService) { }

  async resolve(route: ActivatedRouteSnapshot): Promise<Tag[]> {
    const id: string = route.params['id'];
    return await this.model.readIdeaTags(id);
  }
}

@Injectable()
export class IdeasWithMyTagsResolver implements Resolve<Idea[]> {

  constructor(private model: ModelService) { }

  async resolve(): Promise<Idea[]> {
    return await this.model.findIdeasWithMyTags();
  }
}

@Injectable()
export class NewIdeasResolver implements Resolve<Idea[]> {

  constructor(private model: ModelService) { }

  async resolve(): Promise<Idea[]> {
    return await this.model.findNewIdeas();
  }
}

@Injectable()
export class IdeaCommentsResolver implements Resolve<Comment[]> {

  constructor(private model: ModelService) { }

  async resolve(route: ActivatedRouteSnapshot): Promise<Comment[]> {
    const id: string = route.params['id'];
    return await this.model.readCommentsOf({ type: 'ideas', id });
  }
}

@Injectable()
export class IdeasWithTagResolver implements Resolve<Idea[]> {

  constructor(private model: ModelService) { }

  async resolve(route: ActivatedRouteSnapshot): Promise<Idea[]> {
    const tagname: string = route.parent.params['tagname'];
    return await this.model.findIdeasWithTags([{ tagname }]);
  }
}
