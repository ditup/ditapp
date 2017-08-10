/* tslint:disable:no-unused-variable */
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { MaterialModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

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

  async addTagToUser({ username, tagname, relevance, story }): Promise<UserTag> {
    return { user: { username }, tag: { tagname }, relevance, story };
  }

  async removeUserTag(_username: string, _tagname: string) {}
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
  let spyNotificationsError: jasmine.Spy;
  let modelService;

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
    spyNotificationsError = spyOn(notificationsService, 'error');

    modelService = fixture.debugElement.injector.get(ModelService);

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

  it('should notify when user story is updated', fakeAsync(() => {
    component.updateTagStory({ tagname: 'tag0', story: 'story' });

    tick();

    expect(spyNotificationsInfo.calls.count()).toEqual(1);
    expect(spyNotificationsInfo.calls.first().args[0]).toEqual('Your tag story was updated.');
  }));

  it('should update the tag relevance when dropped to a new relevance box', fakeAsync(() => {

    const spyUpdate = spyOn(modelService, 'updateUserTag').and.callThrough();

    component.dropTagToRelevance({ from: 5, userTag: component.tagLists[5][0] }, 3);
    tick();

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

  it('should notify error when updating tag relevance fails', fakeAsync(() => {


    // rejecting response
    const err = new Error('');
    spyOn(modelService, 'updateUserTag').and.returnValue(Promise.reject(err));

    const [userTag] = component.tagLists[5];

    component.dropTagToRelevance({ from: 5, userTag }, 3);

    tick();

    // notification error should be raised
    expect(spyNotificationsError.calls.count()).toEqual(1);
    expect(spyNotificationsError.calls.first().args[0]).toEqual(`Changing relevance of ${userTag.tag.tagname} failed.`);
  }));

  it('adding tag should work', fakeAsync(() => {
    // spy on model.addTagToUser
    const spyAddTag = spyOn(modelService, 'addTagToUser').and.callThrough();

    // execute
    component.addTag({ tagname: 'tag5' });
    // wait for promises
    tick();

    // calling model with correct data?
    expect(spyAddTag.calls.count()).toEqual(1);
    expect(spyAddTag.calls.first().args[0]).toEqual({
      username: 'user',
      tagname: 'tag5',
      relevance: 3,
      story: ''
    });

    fixture.detectChanges();
    // display the tag?
    const addedTags = fixture.debugElement.queryAll(By.css('.tag-relevance-container-initial .user-tag'));
    expect(addedTags.length).toEqual(1);
    expect(addedTags[0].nativeElement.textContent).toMatch(/tag5/);
  }));

  it('adding tag should notify error when tag was already added', fakeAsync(() => {

    // rejecting response
    const err = new HttpErrorResponse({ status: 409 });
    spyOn(modelService, 'addTagToUser').and.returnValue(Promise.reject(err));

    component.addTag({ tagname: 'tag4' });

    tick();

    // notification error should be raised
    expect(spyNotificationsError.calls.count()).toEqual(1);
    expect(spyNotificationsError.calls.first().args[0]).toEqual('The tag tag4 was already added to you.');
  }));

  it('adding (only) tag should notify error when tag doesn\'t exist', fakeAsync(() => {
    // in reality this case shouldn't happen. when tag doesn't exist, we call createAddTag instead of addTag

    // rejecting response
    const err = new HttpErrorResponse({ status: 404 });
    spyOn(modelService, 'addTagToUser').and.returnValue(Promise.reject(err));

    component.addTag({ tagname: 'nonexistent-tag' });

    tick();

    // notification error should be raised
    expect(spyNotificationsError.calls.count()).toEqual(1);
    expect(spyNotificationsError.calls.first().args[0]).toEqual('The tag nonexistent-tag doesn\'t exist.');
  }));

  it('adding tag should notify error on a generic fail', fakeAsync(() => {

    // rejecting response
    const err = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });
    spyOn(modelService, 'addTagToUser').and.returnValue(Promise.reject(err));

    component.addTag({ tagname: 'nonexistent-tag' });

    tick();

    // notification error should be raised
    expect(spyNotificationsError.calls.count()).toEqual(1);
    expect(spyNotificationsError.calls.first().args[0]).toMatch(/^An unexpected error/);
  }));

  describe('removing tag', () => {

    it('should call a correct model function', fakeAsync(() => {
      // spy on model.addTagToUser
      const spyRemoveTag = spyOn(modelService, 'removeUserTag').and.callThrough();

      // execute
      component.removeTag('tag0');
      // wait for promises
      tick();

      // calling model with correct data?
      expect(spyRemoveTag.calls.count()).toEqual(1);
      expect(spyRemoveTag.calls.first().args).toEqual(['user', 'tag0']);
    }));

    it('should remove the tag from the tag list', fakeAsync(() => {
      // now the tag should be present in view
      const tags5 = fixture.debugElement.queryAll(By.css('.tag-relevance-container-5 .user-tag'));
      expect(tags5.length).toEqual(1);

      // execute
      component.removeTag('tag0');
      // wait for promises
      tick();

      fixture.detectChanges();
      // was the tag removed from view?
      const tags5after = fixture.debugElement.queryAll(By.css('.tag-relevance-container-5 .user-tag'));
      expect(tags5after.length).toEqual(0);

      // but the others should stay
      const tags1 = fixture.debugElement.queryAll(By.css('.tag-relevance-container-1 .user-tag'));
      expect(tags1.length).toEqual(1);
    }));

  });
});
