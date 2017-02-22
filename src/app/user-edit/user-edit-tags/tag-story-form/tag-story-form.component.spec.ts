import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagStoryFormComponent } from './tag-story-form.component';

describe('TagStoryFormComponent', () => {
  let component: TagStoryFormComponent;
  let fixture: ComponentFixture<TagStoryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagStoryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagStoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
