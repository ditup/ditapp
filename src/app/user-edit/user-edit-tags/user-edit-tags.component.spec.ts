/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { MaterialModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { DndModule } from 'ng2-dnd';

import { UserEditTagsComponent } from './user-edit-tags.component';
import { ModelService } from '../../model.service';

import { UserTag } from '../../shared/types';

@Component({ selector: 'app-tag-autocomplete', template: '' })
class TagAutocompleteStubComponent {
}

class ModelStubService {
  async readUserTags() {
    return [];
  }
}

class ActivatedRouteStub {
  private user = { username: 'user' };
  parent = {
    data: Observable.of({ user: this.user })
  };

  private userTags: UserTag[] = [
    { user: this.user, tag: { tagname: 'tag0' }, story: '', relevance: 5 },
    { user: this.user, tag: { tagname: 'tag1' }, story: '', relevance: 4 },
    { user: this.user, tag: { tagname: 'tag2' }, story: '', relevance: 3 },
    { user: this.user, tag: { tagname: 'tag3' }, story: '', relevance: 2 },
    { user: this.user, tag: { tagname: 'tag4' }, story: '', relevance: 1 }
  ];

  data = Observable.of({ userTags: this.userTags });
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

  it('should display a list of user\'s tags', () => {
    const userTags = fixture.debugElement.queryAll(By.css('.user-tag'));
    expect(userTags.length).toEqual(5);
    expect(userTags[0].nativeElement.textContent).toMatch(/tag0/);
  });
});
