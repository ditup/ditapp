import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TagStoryFormComponent } from './tag-story-form.component';

describe('TagStoryFormComponent', () => {
  let component: TagStoryFormComponent;
  let fixture: ComponentFixture<TagStoryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagStoryFormComponent ],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagStoryFormComponent);
    component = fixture.componentInstance;
    component.userTag = {
      story: '',
      user: { username: '' },
      tag: { tagname: '' },
      relevance: 1
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
