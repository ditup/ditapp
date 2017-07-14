import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsRelatedToMyTagsComponent } from './tags-related-to-my-tags.component';

describe('TagsRelatedToMyTagsComponent', () => {
  let component: TagsRelatedToMyTagsComponent;
  let fixture: ComponentFixture<TagsRelatedToMyTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsRelatedToMyTagsComponent ]
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
});
