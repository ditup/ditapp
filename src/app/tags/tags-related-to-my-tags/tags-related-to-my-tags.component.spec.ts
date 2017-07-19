import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { TagsRelatedToMyTagsComponent } from './tags-related-to-my-tags.component';

import { By } from '@angular/platform-browser';

class ActivatedRouteStub {
  public data = Observable.of({
    tags: [
      { tagname: 'tag0' },
      { tagname: 'tag1' },
      { tagname: 'tag2' },
      { tagname: 'tag3' }
    ]
  });
}

@Component({ selector: 'app-tag-list', template: '' })
class TagListStubComponent {
  @Input() tags = [];
}

describe('TagsRelatedToMyTagsComponent', () => {
  let component: TagsRelatedToMyTagsComponent;
  let fixture: ComponentFixture<TagsRelatedToMyTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsRelatedToMyTagsComponent, TagListStubComponent ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsRelatedToMyTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should provide a list of found tags to tag-list component', () => {
    const tagList = fixture.debugElement.query(By.css('app-tag-list'));
    expect(tagList.componentInstance.tags.length).toEqual(4);
  });
});
