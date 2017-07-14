import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsRelatedToTagsComponent } from './tags-related-to-tags.component';

describe('TagsRelatedToTagsComponent', () => {
  let component: TagsRelatedToTagsComponent;
  let fixture: ComponentFixture<TagsRelatedToTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsRelatedToTagsComponent ]
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
});
