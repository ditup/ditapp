import { TestBed, inject } from '@angular/core/testing';

import {
  PopularTagsResolver,
  TagsRelatedToMyTagsResolver,
  RandomTagsResolver,
  TagsRelatedToTagResolver } from './tags-resolver.service';

import { ModelService } from '../model.service';

import { Tag } from '../shared/types';

class ModelStubService {
  public async findTagsByMyTags(): Promise<Tag[]> {
    return [
      { tagname: 'tag1' },
      { tagname: 'tag2' },
      { tagname: 'tag3' },
      { tagname: 'tag4' }
    ];
  }

  public async findRandomTags(): Promise<Tag[]> {
    return [
      { tagname: 'tag0' }
    ];
  }

  public async findPopularTags(): Promise<Tag[]> {
    return [
      { tagname: 'tag1', popularityByUses: 21 },
      { tagname: 'tag0', popularityByUses: 12 },
      { tagname: 'tag2', popularityByUses: 2 }
    ];
  }

  public async findTagsByTags(tagsIn: Tag[]): Promise<Tag[]> {

    // the tags to choose from
    const tags: Tag[] =  [
      { tagname: 'tag0' },
      { tagname: 'tag1' },
      { tagname: 'tag2' },
      { tagname: 'tag3' },
      { tagname: 'tag4' },
      { tagname: 'tag5' }
    ];

    // provided tagnames
    const tagnamesIn = tagsIn.map(tag => tag.tagname);

    // we return all the tags other than the provided ones
    const tagsOut = tags.filter(tag => tagnamesIn.indexOf(tag.tagname) === -1);

    return tagsOut;
  }
}

describe('TagsRelatedToMyTagsResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TagsRelatedToMyTagsResolver,
        { provide: ModelService, useClass: ModelStubService }
      ],
    });
  });

  it('should be created', inject([TagsRelatedToMyTagsResolver], (service: TagsRelatedToMyTagsResolver) => {
    expect(service).toBeTruthy();
  }));

  it('should resolve with some tags', inject([TagsRelatedToMyTagsResolver], async (service: TagsRelatedToMyTagsResolver) => {
    const tags = await service.resolve();

    expect(tags.length).toEqual(4);
  }));
});

describe('RandomTagsResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RandomTagsResolver,
        { provide: ModelService, useClass: ModelStubService }
      ],
    });
  });

  it('should be created', inject([RandomTagsResolver], (service: RandomTagsResolver) => {
    expect(service).toBeTruthy();
  }));

  it('should resolve with some tags', inject([RandomTagsResolver], async (service: RandomTagsResolver) => {
    const tags = await service.resolve();

    expect(tags.length).toEqual(1);
  }));
});

describe('PopularTagsResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PopularTagsResolver,
        { provide: ModelService, useClass: ModelStubService }
      ],
    });
  });

  it('should be created', inject([PopularTagsResolver], (service: PopularTagsResolver) => {
    expect(service).toBeTruthy();
  }));

  it('should resolve with some tags', inject([PopularTagsResolver], async (service: PopularTagsResolver) => {
    expect(service).toBeTruthy();
    const tags = await service.resolve();

    expect(tags.length).toEqual(3);
  }));
});

describe('TagsRelatedToTagResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TagsRelatedToTagResolver,
        { provide: ModelService, useClass: ModelStubService }
      ],
    });
  });

  it('should be created', inject([TagsRelatedToTagResolver], (service: TagsRelatedToTagResolver) => {
    expect(service).toBeTruthy();
  }));

  it('should resolve with some tags', inject([TagsRelatedToTagResolver], async (service: TagsRelatedToTagResolver) => {
    const routeSnapshotStub: any = {
      parent: {
        params: { tagname: 'tag1' }
      }
    };
    const tags = await service.resolve(routeSnapshotStub);

    expect(tags.length).toEqual(5);
  }));
});
