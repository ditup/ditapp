import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { By } from '@angular/platform-browser';

import { UserListWithTagsComponent } from './user-list-with-tags.component';

import { User, UserTag } from '../types';

@Component({ selector: 'app-user-small', template: '' })
class UserSmallStubComponent {
  @Input() user: User;
}

@Component({ selector: 'app-user-tag-list', template: '' })
class UserTagListStubComponent {
  @Input() user: User;
  @Input() userTags: UserTag[];
}

describe('UserListWithTagsComponent', () => {
  let component: UserListWithTagsComponent;
  let fixture: ComponentFixture<UserListWithTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserListWithTagsComponent,
        UserSmallStubComponent,
        UserTagListStubComponent
      ],
      imports: [
        MaterialModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListWithTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('provided users, show list of users with their tags', () => {
    component.users = [
      { username: 'user0', userTags: [] },
      { username: 'user2', userTags: [
        { tag: { tagname: 'tag3' } }, { tag: { tagname: 'tag2' } }
      ] },
      { username: 'user1', userTags: [] }
    ] as User[];

    fixture.detectChanges();

    const userComponents = fixture.debugElement.queryAll(By.css('app-user-small'));
    expect(userComponents.length).toEqual(3);

    const userTagComponents = fixture.debugElement.queryAll(By.css('app-user-tag-list'));

    const userTag1 = userTagComponents[1].componentInstance;

    expect(userTag1.userTags.length).toEqual(2);
  });
});
