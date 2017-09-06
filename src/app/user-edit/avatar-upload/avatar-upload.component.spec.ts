import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AvatarUploadComponent } from './avatar-upload.component';
import { AuthService } from '../../auth.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { HeaderControlService } from '../../header-control.service';
import * as config from '../../config';

class AuthStubService {
  credentials = {
    username: 'user0',
    password: 'password0'
  };

  username = 'user0';
}

// tslint:disable-next-line:component-selector
@Component({ selector: 'fancy-image-uploader', template: '' })
class FancyImageUploaderStubComponent {
  @Input() options;
  @Output() onUpload = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();
}

describe('AvatarUploadComponent', () => {
  let component: AvatarUploadComponent;
  let fixture: ComponentFixture<AvatarUploadComponent>;
  let uploadComponent: FancyImageUploaderStubComponent;

  let notifyInfoSpy: jasmine.Spy;
  let notifyErrorSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AvatarUploadComponent,
        FancyImageUploaderStubComponent
      ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        NotificationsService,
        HeaderControlService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarUploadComponent);
    component = fixture.componentInstance;
    uploadComponent = fixture.debugElement.query(By.css('fancy-image-uploader')).componentInstance;
    fixture.detectChanges();

    // spy on notifications service
    const notify = fixture.debugElement.injector.get(NotificationsService);
    notifyInfoSpy = spyOn(notify, 'info');
    notifyErrorSpy = spyOn(notify, 'error');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('fancy image uploader should be provided with correct options', () => {

    expect(uploadComponent.options).toEqual({
      uploadUrl: `${config.api.baseUrl}/users/user0/avatar`,
      httpMethod: 'PATCH',
      authTokenPrefix: 'Basic',
      authToken: btoa('user0:password0'),
      fieldName: 'avatar',
      autoUpload: true,
      maxImageSize: 2,
      allowedImageTypes: [ 'image/png', 'image/jpeg' ]
    });

  });

  it('successful upload should be notified', () => {
    uploadComponent.onUpload.emit();
    fixture.detectChanges();

    expect(notifyInfoSpy.calls.count()).toEqual(1);
    expect(notifyInfoSpy.calls.first().args[0]).toEqual('Your profile picture was changed.');
  });

  it('upload error should be notified', () => {
    uploadComponent.onError.emit('error');
    fixture.detectChanges();

    expect(notifyErrorSpy.calls.count()).toEqual(1);
    expect(notifyErrorSpy.calls.first().args[0]).toEqual('error');
  });
});
