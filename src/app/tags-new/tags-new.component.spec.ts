/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TagsNewComponent } from './tags-new.component';

describe('TagsNewComponent', () => {
  let component: TagsNewComponent;
  let fixture: ComponentFixture<TagsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
