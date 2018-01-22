import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { PeopleWithTagsComponent } from './people-with-tags.component';

import { User, Tag } from '../../shared/types';
import { ModelService } from '../../model.service';

@Component({ selector: 'app-select-tags', template: '' })
class SelectTagsStubComponent {
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSelected = new EventEmitter<Tag[]>();
}

@Component({ selector: 'app-user-list-with-tags', template: '' })
class UserListWithTagsStubComponent {
  @Input() users: User[] = [];
}

class ModelStubService {
  async findUsersByTags(_tags: Tag[]): Promise<User[]> {
    return [
      { username: 'user0', userTags: [
        { tag: { tagname: 'tag0' }, relevance: 2 },
        { tag: { tagname: 'tag1' }, relevance: 5 },
        { tag: { tagname: 'tag2' }, relevance: 4 },
        { tag: { tagname: 'tag3' }, relevance: 3 },

      ] },
      { username: 'user1', userTags: [
        { tag: { tagname: 'tag1' }, relevance: 2 },
        { tag: { tagname: 'tag2' }, relevance: 3 },
        { tag: { tagname: 'tag3' }, relevance: 3 },

      ] },
      { username: 'user2', userTags: [
        { tag: { tagname: 'tag0' }, relevance: 5 },

      ] },
      { username: 'user3', userTags: [
        { tag: { tagname: 'tag3' }, relevance: 1 },

      ] }
    ] as User[];
  }
}

describe('PeopleWithTagsComponent', () => {
  let component: PeopleWithTagsComponent;
  let fixture: ComponentFixture<PeopleWithTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PeopleWithTagsComponent,
        SelectTagsStubComponent,
        UserListWithTagsStubComponent
      ],
      providers: [
        { provide: ModelService, useClass: ModelStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleWithTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should contain tag selecting component', () => {
    const tagSelector = fixture.debugElement.query(By.css('app-select-tags'));
    expect(tagSelector).toBeTruthy();
  });

  it('should contain user list component', () => {
    const tagList = fixture.debugElement.query(By.css('app-user-list-with-tags'));
    expect(tagList).toBeTruthy();
  });

  it('when tags are selected, related users should be found and provided to app-user-list-with-tags', fakeAsync(() => {
    const selectTagsComponent = fixture.debugElement.query(By.css('app-select-tags')).componentInstance;

    const emitter = selectTagsComponent.onSelected;

    emitter.emit([
      { tagname: 'tag0' },
      { tagname: 'tag1' },
      { tagname: 'tag2' },
      { tagname: 'tag3' }
    ]);

    const userListComponent = fixture.debugElement.query(By.css('app-user-list-with-tags')).componentInstance;

    fixture.detectChanges();

    tick();

    fixture.detectChanges();

    console.log(userListComponent.users);

    expect(userListComponent.users.length).toEqual(4);
  }));
});
