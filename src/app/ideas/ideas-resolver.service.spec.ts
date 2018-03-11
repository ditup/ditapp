import { TestBed, inject } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';

import {
  IdeaResolver, IdeaCommentsResolver, IdeaTagsResolver, IdeasWithMyTagsResolver,
  IdeasWithTagResolver, NewIdeasResolver
} from './ideas-resolver.service';

import { ModelService } from '../model.service';

import { Comment, Idea, Tag } from '../shared/types';

class ModelStubService {
  public async readIdea(_id): Promise<Idea> {
    return {
      id: '123456',
      title: 'test title',
      detail: 'test detail',
      creator: {
        username: 'test-user'
      }
    };
  }

  public async readIdeaTags(_id): Promise<Tag[]> {
    return [
      { tagname: 'tag0' },
      { tagname: 'tag1' },
      { tagname: 'tag2' }
    ];
  }

  public async readCommentsOf({ type: _type, id: _id }): Promise<Comment[]> {
    return [
      { id: '00000', content: 'asdf', created: 1, creator: { username: 'test' } },
      { id: '11111', content: 'asdf', created: 1, creator: { username: 'test' } }
    ];
  }

  public async findIdeasWithMyTags(): Promise<Idea[]> {
    return [
      { id: '112233', title: 'ahoj idea', detail: 'idea detail' }
    ];
  }

  public async findNewIdeas(): Promise<Idea[]> {
    return [
      { id: '112233', title: 'ahoj idea', detail: 'idea detail' },
      { id: '123456', title: 'ahoj2 idea', detail: 'idea detail' }
    ];
  }

  public async findIdeasWithTags(): Promise<Idea[]> {
    return [
      { id: '112233', title: 'ahoj idea', detail: 'idea detail' },
      { id: '123456', title: 'ahoj2 idea', detail: 'idea detail' }
    ];
  }
}

class ActivatedRouteSnapshotStub {
  params = { id: '123456' };
  parent = { params: { id: '123456' } };
}

describe('IdeaResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IdeaResolver,
        { provide: ModelService, useClass: ModelStubService },
        { provide: ActivatedRouteSnapshot, useClass: ActivatedRouteSnapshotStub }
      ],
    });
  });

  it('should be created', inject([IdeaResolver], (service: IdeaResolver) => {
    expect(service).toBeTruthy();
  }));

  it('should resolve with idea',
     inject([IdeaResolver, ActivatedRouteSnapshot], async (service: IdeaResolver, route: ActivatedRouteSnapshot) => {
    const idea = await service.resolve(route);

    expect(idea.id).toEqual('123456');
  }));
});

describe('IdeaTagsResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IdeaTagsResolver,
        { provide: ModelService, useClass: ModelStubService },
        { provide: ActivatedRouteSnapshot, useClass: ActivatedRouteSnapshotStub }
      ],
    });
  });

  it('should be created', inject([IdeaTagsResolver], (service: IdeaTagsResolver) => {
    expect(service).toBeTruthy();
  }));

  it('should resolve with some tags',
     inject([IdeaTagsResolver, ActivatedRouteSnapshot], async (service: IdeaTagsResolver, route: ActivatedRouteSnapshot) => {
    const tags = await service.resolve(route);

    expect(tags.length).toEqual(3);
  }));
});

describe('IdeasWithMyTagsResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IdeasWithMyTagsResolver,
        { provide: ModelService, useClass: ModelStubService }
      ],
    });
  });

  it('should be created', inject([IdeasWithMyTagsResolver], (service: IdeasWithMyTagsResolver) => {
    expect(service).toBeTruthy();
  }));

  it('should resolve with some ideas',
     inject([IdeasWithMyTagsResolver], async (service: IdeasWithMyTagsResolver) => {
    const ideas = await service.resolve();

    expect(ideas.length).toEqual(1);
  }));
});

describe('IdeasNewResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NewIdeasResolver,
        { provide: ModelService, useClass: ModelStubService }
      ],
    });
  });

  it('should be created', inject([NewIdeasResolver], (service: NewIdeasResolver) => {
    expect(service).toBeTruthy();
  }));

  it('should resolve with some ideas',
     inject([NewIdeasResolver], async (service: NewIdeasResolver) => {
    const ideas = await service.resolve();

    expect(ideas.length).toEqual(2);
  }));
});

describe('IdeaCommentsResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IdeaCommentsResolver,
        { provide: ModelService, useClass: ModelStubService },
        { provide: ActivatedRouteSnapshot, useClass: ActivatedRouteSnapshotStub }
      ],
    });
  });

  it('should be created', inject([IdeaCommentsResolver], (service: IdeaCommentsResolver) => {
    expect(service).toBeTruthy();
  }));

  it('should resolve with some comments',
     inject([IdeaCommentsResolver, ActivatedRouteSnapshot], async (service: IdeaCommentsResolver, route: ActivatedRouteSnapshot) => {
    const comments = await service.resolve(route);

    expect(comments.length).toEqual(2);
  }));
});

describe('IdeasWithTagResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IdeasWithTagResolver,
        { provide: ModelService, useClass: ModelStubService },
        { provide: ActivatedRouteSnapshot, useClass: ActivatedRouteSnapshotStub }
      ],
    });
  });

  it('should be created', inject([IdeasWithTagResolver], (service: IdeasWithTagResolver) => {
    expect(service).toBeTruthy();
  }));

  it('should resolve with some ideas',
     inject([IdeasWithTagResolver, ActivatedRouteSnapshot], async (service: IdeasWithTagResolver, route: ActivatedRouteSnapshot) => {
    const ideas = await service.resolve(route);

    expect(ideas.length).toEqual(2);
  }));
});
