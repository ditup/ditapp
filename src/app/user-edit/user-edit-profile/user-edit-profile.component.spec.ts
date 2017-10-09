import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Observable } from 'rxjs/Observable';

import { ModelService } from '../../model.service';
import { DialogService } from '../../dialog.service';

import { User } from '../../shared/types';
import { NotificationsService } from '../../notifications/notifications.service';

import { UserEditProfileComponent } from './user-edit-profile.component';

@Component({ selector: 'app-avatar-upload', template: '' })
class AvatarUploadStubComponent { }

class ModelStubService {
  async updateUser(username: string, profile: { givenName: string, familyName: string, description: string }): Promise<User> {

    const { givenName, familyName, description } = profile;

    return { username, givenName, familyName, description } as User;
  }
}

class ActivatedRouteStub {
  parent = {
    data: Observable.of({ user: {
      username: 'test',
      givenName: 'givenName',
      familyName: '',
      description: ''
    } })
  };
}

describe('UserEditProfileComponent', () => {
  let component: UserEditProfileComponent;
  let fixture: ComponentFixture<UserEditProfileComponent>;
  let spyNotify: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserEditProfileComponent,
        AvatarUploadStubComponent
      ],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ModelService, useClass: ModelStubService },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        DialogService,
        NotificationsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditProfileComponent);
    component = fixture.componentInstance;

    // spy on the NotificationsService.info()
    const notificationsService = fixture.debugElement.injector.get(NotificationsService);
    spyNotify = spyOn(notificationsService, 'info');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save the data when clicking update', fakeAsync(() => {

    // spy on model.updateUser
    const modelService = fixture.debugElement.injector.get(ModelService);
    const spyUpdate = spyOn(modelService, 'updateUser').and.callThrough();
    // submit the form
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);

    // wait for asynchronous actions to resolve
    tick();

    // was model called?
    expect(spyUpdate.calls.count()).toEqual(1);
    // with proper arguments?
    expect(spyUpdate.calls.first().args).toEqual(['test', { givenName: 'givenName', familyName: '', description: '' }]);

  }));

  it('should show a notification when successfully updated', fakeAsync(() => {

    // submit the form
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);
    fixture.detectChanges();

    // wait for asynchronous actions to resolve
    tick();

    // was notification service called?
    expect(spyNotify.calls.count()).toEqual(1);
    expect(spyNotify.calls.first().args[0]).toEqual('Your profile was updated.');
  }));
});
