import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PeopleNewComponent } from './people-new.component';
import { User } from '../../shared/types';

@Component({ selector: 'app-user-list-with-tags', template: '' })
class UserListWithTagsStubComponent {
  @Input() users: User[] = [];
}

class ActivatedRouteStub {
  public data = Observable.of({
    users: [
      { username: 'user0' },
      { username: 'user0' },
      { username: 'user0' },
      { username: 'user0' },
      { username: 'user0' }
    ]
  });
}

describe('PeopleNewComponent', () => {
  let component: PeopleNewComponent;
  let fixture: ComponentFixture<PeopleNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PeopleNewComponent,
        UserListWithTagsStubComponent
      ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display a list of new users', () => {
    const userList = fixture.debugElement.query(By.css('app-user-list-with-tags'));
    expect(userList).toBeTruthy();
    expect(userList.componentInstance.users.length).toEqual(5);
    expect(userList.componentInstance.users[0].username).toEqual('user0');
  });
});
