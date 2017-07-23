import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { TagRelatedPeopleComponent } from './tag-related-people.component';

import { User } from '../../shared/types';

class ActivatedRouteStub {
  data = Observable.of({ users: [
    { username: 'user0' },
    { username: 'user1' },
    { username: 'user2' },
    { username: 'user3' },
    { username: 'user4' }
  ] });
}

@Component({ selector: 'app-user-list-with-tags', template: '' })
class UserListWithTagsStubComponent {
  @Input() users: User[] = [];
}

describe('TagRelatedPeopleComponent', () => {
  let component: TagRelatedPeopleComponent;
  let fixture: ComponentFixture<TagRelatedPeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TagRelatedPeopleComponent,
        UserListWithTagsStubComponent
      ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagRelatedPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should provide a list of found users to user-list component', () => {
    const userList = fixture.debugElement.query(By.css('app-user-list-with-tags'));
    expect(userList).toBeTruthy();
    expect(userList.componentInstance.users.length).toEqual(5);
  });
});
