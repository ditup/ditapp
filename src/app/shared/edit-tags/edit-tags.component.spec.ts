import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Output } from '@angular/core';

import { EditTagsComponent } from './edit-tags.component';
import { MaterialModule } from '../../material.module';

@Component({ selector: 'app-tag-autocomplete', template: '' })
class TagAutocompleteStubComponent {
  @Output() action = new EventEmitter();
  @Output() action404 = new EventEmitter();
}

describe('EditTagsComponent', () => {
  let component: EditTagsComponent;
  let fixture: ComponentFixture<EditTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditTagsComponent,
        TagAutocompleteStubComponent
      ],
      imports: [
        MaterialModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
