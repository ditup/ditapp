import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsRelatedToTagsComponent } from './tags-related-to-tags.component';

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { By } from '@angular/platform-browser';
import * as _ from 'lodash';
import { Tag } from '../../shared/types';
import { ModelService } from '../../model.service';

@Component({ selector: 'app-select-tags', template: '' })
class SelectTagsStubComponent {
  @Output() onSelected = new EventEmitter<Tag[]>();
}

@Component({ selector: 'app-tag-list', template: '' })
class TagListStubComponent {
  @Input() tags: Tag[] = [];
}

class ModelStubService {
  async findTagsByTags(tagsIn: Tag[]): Promise<Tag[]> {
    const allTags: Tag[] = [
      { tagname: 'tag0' },
      { tagname: 'tag1' },
      { tagname: 'tag2' },
      { tagname: 'tag3' },
      { tagname: 'tag4' },
      { tagname: 'tag5' },
      { tagname: 'tag6' }
    ];

    const tagnamesIn = _.map(tagsIn, (tag: Tag) => tag.tagname);
    const tagsOut: Tag[] = _.filter(allTags, (tag: Tag) => {
      return tagnamesIn.indexOf(tag.tagname) === -1;
    });
    return tagsOut;
  }
}

describe('TagsRelatedToTagsComponent', () => {
  let component: TagsRelatedToTagsComponent;
  let fixture: ComponentFixture<TagsRelatedToTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TagsRelatedToTagsComponent,
        SelectTagsStubComponent,
        TagListStubComponent
      ],
      providers: [
        { provide: ModelService, useClass: ModelStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsRelatedToTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should contain tag selecting component', () => {
    const tagSelector = fixture.debugElement.query(By.css('app-select-tags'));
    expect(tagSelector).toBeTruthy();
  });

  it('should contain tag list component', () => {
    const tagList = fixture.debugElement.query(By.css('app-tag-list'));
    expect(tagList).toBeTruthy();
  });

  it('when tags are selected, related tags should be found and provided to app-tag-list', fakeAsync(() => {
    const selectTagsComponent = fixture.debugElement.query(By.css('app-select-tags')).componentInstance;

    const emitter = selectTagsComponent.onSelected;

    emitter.emit([
      { tagname: 'tag0' },
      { tagname: 'tag1' },
      { tagname: 'tag2' },
      { tagname: 'tag3' }
    ]);

    const tagListComponent = fixture.debugElement.query(By.css('app-tag-list')).componentInstance;

    fixture.detectChanges();

    tick();

    fixture.detectChanges();

    expect(tagListComponent.tags.length).toEqual(3);
  }));
});
