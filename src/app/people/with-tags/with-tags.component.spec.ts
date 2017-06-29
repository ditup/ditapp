import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithTagsComponent } from './with-tags.component';

import { Component, Input } from '@angular/core';
import { MaterialModule } from '@angular/material';

import { AuthService } from '../../auth.service';
import { ModelService } from '../../model.service';

/* stub child components */
@Component({ selector: 'app-tag-autocomplete', template: '' })
class TagAutocompleteStubComponent { }

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
class AuthStubService { }
class ModelStubService { }

describe('WithTagsComponent', () => {
  let component: WithTagsComponent;
  let fixture: ComponentFixture<WithTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WithTagsComponent,
        TagAutocompleteStubComponent,
        UserSmallStubComponent,
        UserTagListStubComponent
      ],
      imports: [
        MaterialModule
      ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        { provide: ModelService, useClass: ModelStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
