import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ModelService } from '../../model.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { User } from '../../shared/types';

import { UserEditLocationComponent } from './user-edit-location.component';

@Component({ selector: 'app-select-location', template: '' })
class SelectLocationStubComponent {
  @Input() location;
  @Input() disabled;
  @Output() onSubmit = new EventEmitter<[number, number]>();
}

class ActivatedRouteStub {
  parent = {
    data: Observable.of({ user: { username: 'test' } })
  };
}

class ModelStubService {
  async updateUser(username, fields) {
    return { username, preciseLocation: fields.location } as User;
  }
}

describe('UserEditLocationComponent', () => {
  let component: UserEditLocationComponent;
  let fixture: ComponentFixture<UserEditLocationComponent>;
  let spyNotificationsInfo: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserEditLocationComponent,
        SelectLocationStubComponent
      ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ModelService, useClass: ModelStubService },
        NotificationsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditLocationComponent);
    component = fixture.componentInstance;

    // spy on the NotificationsService.info()
    const notificationsService = fixture.debugElement.injector.get(NotificationsService);
    spyNotificationsInfo = spyOn(notificationsService, 'info');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should notify about success after a successful update', fakeAsync(() => {

    // emit the location-update event
    const selectLocation = fixture.debugElement.query(By.css('app-select-location'));
    selectLocation.componentInstance.onSubmit.emit([7, 9]);

    // wait for model.updateUser to resolve
    tick();

    expect(spyNotificationsInfo.calls.count()).toEqual(1);

    expect(spyNotificationsInfo.calls.first().args[0]).toEqual('Your location was updated.');
  }));
});
