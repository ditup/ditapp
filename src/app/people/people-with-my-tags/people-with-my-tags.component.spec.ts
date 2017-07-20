import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { By } from '@angular/platform-browser';

import { PeopleWithMyTagsComponent } from './people-with-my-tags.component';
import { User } from '../../shared/types';

@Component({ selector: 'app-user-list-with-tags', template: '' })
class UserListWithTagsStubComponent {
  @Input() users: User[];
}

class ActivatedRouteStub {
  public data = Observable.of({
    users: [
      { username: 'user0', userTags: [] },
      { username: 'user1', userTags: [] },
      { username: 'user2', userTags: [] }
    ]
  });
}

describe('PeopleWithMyTagsComponent', () => {
  let component: PeopleWithMyTagsComponent;
  let fixture: ComponentFixture<PeopleWithMyTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PeopleWithMyTagsComponent,
        UserListWithTagsStubComponent
      ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleWithMyTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display a list of found users and their user-tags', () => {
    const userList = fixture.debugElement.query(By.css('app-user-list-with-tags'));
    expect(userList).toBeTruthy();
    console.log(userList.componentInstance);
    expect(userList.componentInstance.users.length).toEqual(3);
  });
});
