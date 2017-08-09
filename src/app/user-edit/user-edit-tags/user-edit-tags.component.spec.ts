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
import { NotificationsService } from '../../notifications/notifications.service';

import { UserTag } from '../../shared/types';

@Component({ selector: 'app-tag-autocomplete', template: '' })
class TagAutocompleteStubComponent {
}

class ModelStubService {
  async updateUserTag(_username: string, _tagname: string, _data: { story?: string, relevance?: number}): Promise<any> {
    return;
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
  let spyNotificationsInfo: jasmine.Spy;

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
        NotificationsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditTagsComponent);
    component = fixture.componentInstance;

    // spy on the NotificationsService.info()
    const notificationsService = fixture.debugElement.injector.get(NotificationsService);
    spyNotificationsInfo = spyOn(notificationsService, 'info');

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

  it('should notify when user story is updated', async(async () => {
    await component.updateTagStory({ tagname: 'tag0', story: 'story' });

    expect(spyNotificationsInfo.calls.count()).toEqual(1);
    expect(spyNotificationsInfo.calls.first().args[0]).toEqual('Your tag story was updated.');
  }));

  it('should update the tag relevance when dropped to a new relevance box', async(async () => {

    const modelService = fixture.debugElement.injector.get(ModelService);
    const spyUpdate = spyOn(modelService, 'updateUserTag').and.callThrough();

    await component.dropTagToRelevance({ from: 5, userTag: component.tagLists[5][0] }, 3);
    // model.updateUserTag should be called with the right data
    expect(spyUpdate.calls.count()).toEqual(1);
    expect(spyUpdate.calls.first().args).toEqual(['user', 'tag0', { relevance: 3 }]);
    fixture.detectChanges();
    // the tag should be removed from the original box
    const box5 = fixture.debugElement.queryAll(By.css('.tag-relevance-container-5 .user-tag'));
    expect(box5.length).toEqual(0);
    // the tag should be added to the new box
    const box3 = fixture.debugElement.queryAll(By.css('.tag-relevance-container-3 .user-tag'));
    expect(box3.length).toEqual(2);
  }));

});
