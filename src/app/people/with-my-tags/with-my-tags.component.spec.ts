import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithMyTagsComponent } from './with-my-tags.component';

import { Component, Input } from '@angular/core';
import { MaterialModule } from '@angular/material';

import { ModelService } from '../../model.service';

/* stub child components */
@Component({ selector: 'app-user-small', template: '' })
class UserSmallStubComponent {
  @Input() user;
}

@Component({ selector: 'app-user-tag-list', template: '' })
class UserTagListStubComponent {
  @Input() user;
  @Input() userTags;
}

/* stub services */
class ModelStubService {
  findUsersByMyTags() {}
}

describe('WithMyTagsComponent', () => {
  let component: WithMyTagsComponent;
  let fixture: ComponentFixture<WithMyTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WithMyTagsComponent,
        UserSmallStubComponent,
        UserTagListStubComponent
      ],
      imports: [
        MaterialModule
      ],
      providers: [
        { provide: ModelService, useClass: ModelStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithMyTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
