import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { IdeasWithMyTagsComponent } from './ideas-with-my-tags.component';
import { MaterialModule } from '../../material.module';

@Component({ selector: 'app-tag-list', template: '' })
class TagListStubComponent {
  @Input() tags;
}

describe('IdeasWithMyTagsComponent', () => {
  let component: IdeasWithMyTagsComponent;
  let fixture: ComponentFixture<IdeasWithMyTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        IdeasWithMyTagsComponent,
        TagListStubComponent
      ],
      imports: [
        MaterialModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdeasWithMyTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
