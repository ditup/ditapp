/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Component } from '@angular/core';

import { MaterialModule, MdSnackBar, MdDialog } from '@angular/material';
import { DebugElement } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { DndModule } from 'ng2-dnd';

import { UserEditTagsComponent } from './user-edit-tags.component';
import { ModelService } from '../../model.service';

@Component({ selector: 'app-tag-autocomplete', template: '' })
class TagAutocompleteStubComponent {
}

class ModelStubService {
  async readUserTags() {
    return [];
  }
}

class ActivatedRouteStub {
  parent = {
    data: Observable.of({ user: {} })
  };
}

describe('UserEditTagsComponent', () => {
  let component: UserEditTagsComponent;
  let fixture: ComponentFixture<UserEditTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserEditTagsComponent,
        TagAutocompleteStubComponent
      ],
      imports: [
        MaterialModule,
        DndModule.forRoot()
      ],
      providers: [
        { provide: ModelService, useClass: ModelStubService },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },

      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
