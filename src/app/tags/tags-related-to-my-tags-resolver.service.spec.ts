import { TestBed, inject } from '@angular/core/testing';

import { TagsRelatedToMyTagsResolver } from './tags-related-to-my-tags-resolver.service';

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
